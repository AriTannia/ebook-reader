package com.aritan.ebook_reader.features.library;

import com.aritan.ebook_reader.common.constants.messages.library.UserLibraryMessage;
import com.aritan.ebook_reader.common.enums.book.LibraryAccessStatus;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.ReadingProgress;
import com.aritan.ebook_reader.common.models.book.UserLibrary;
import com.aritan.ebook_reader.common.models.order.Order;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.library.dtos.LibraryFilterRequest;
import com.aritan.ebook_reader.features.library.dtos.UserLibraryResponse;
import com.aritan.ebook_reader.features.library.readinghistory.IReadingProgressRepository;
import com.aritan.ebook_reader.features.library.utilities.LibraryMapper;
import com.aritan.ebook_reader.features.library.utilities.LibrarySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserLibraryService implements IUserLibraryService {
    private final IUserLibraryRepository userLibraryRepository;
    private final IReadingProgressRepository readingProgressRepository;
    private final LibraryMapper libraryMapper;

    @Override
    @Transactional
    public void grantAcess(Order order) {
        for(OrderItem item : order.getItems()){
            UserLibrary library = userLibraryRepository
                    .findByUser_UserIdAndBook_BookId(
                            order.getUser().getUserId(), item.getBook().getBookId())
                    .orElseGet(UserLibrary::new);

            libraryMapper.toEntity(item, order.getUser(), library);
            library.setAccessStatus(LibraryAccessStatus.ACTIVE);

            userLibraryRepository.save(library);
        }
    }

    @Override
    @Transactional
    public void revokeAccess(Long userId, Long bookId, String reason) {
        UserLibrary library = userLibraryRepository
                .findByUser_UserIdAndBook_BookId(userId, bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                                String.format(
                                        UserLibraryMessage.USER_LIBRARY_ENTRY_NOT_FOUND, userId, bookId)));

        library.setAccessStatus(LibraryAccessStatus.REVOKED);
        userLibraryRepository.save(library);
    }

    @Override
    public Page<UserLibraryResponse> getMyLibrary(Long userId, LibraryFilterRequest filterRequest, Pageable pageable) {
        Specification<UserLibrary> spec = Specification
                .where(LibrarySpecification.hasUser(userId))
                .and(LibrarySpecification.hasAccessStatus(filterRequest.getAccessStatus()))
                .and(LibrarySpecification.isFavorite(filterRequest.getIsFavorite()))
                .and(LibrarySpecification.hasKeyword(filterRequest.getKeyword()))
                .and(LibrarySpecification.hasAuthor(filterRequest.getAuthorId()))
                .and(LibrarySpecification.hasCategory(filterRequest.getCategoryId()));

        Page<UserLibrary> result = userLibraryRepository.findAll(spec, pageable);

        List<Long> bookIds = result.getContent().stream()
                .map(userLibrary -> userLibrary.getBook().getBookId())
                .toList();

        Map<Long, ReadingProgress> progressMap = readingProgressRepository
                .findByUser_UserIdAndBook_BookIdIn(userId, bookIds)
                .stream()
                .collect(Collectors.toMap(
                        rp -> rp.getBook().getBookId(), rp -> rp));

        return result.map(userLibrary ->
                libraryMapper.toResponse(userLibrary, progressMap.get(userLibrary.getBook().getBookId())));
    }

    @Override
    public boolean hasAccess(Long userId, Long bookId) {
        return userLibraryRepository.existsByUser_UserIdAndBook_BookIdAndAccessStatus(
                userId, bookId, LibraryAccessStatus.ACTIVE);
    }

    @Override
    @Transactional
    public void toggleFavorite(Long userId, Long bookId, boolean isFavorite) {
        UserLibrary library = userLibraryRepository
                .findByUser_UserIdAndBook_BookId(userId, bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                                String.format(
                                        UserLibraryMessage.USER_LIBRARY_ENTRY_NOT_FOUND, userId, bookId)));

        library.setIsFavorite(isFavorite);
        userLibraryRepository.save(library);
    }

    @Override
    @Transactional
    public void addBookToUserLibrary(User user, OrderItem orderItem) {
        boolean existedBook = userLibraryRepository
                .existsByUser_UserIdAndBook_BookId(
                        user.getUserId(), orderItem.getBook().getBookId());

        if(!existedBook){
            UserLibrary userLibrary = new UserLibrary();
            libraryMapper.toEntity(orderItem, user, userLibrary);
            userLibrary.setAccessStatus(LibraryAccessStatus.ACTIVE);

            userLibraryRepository.save(userLibrary);
        }
    }

}
