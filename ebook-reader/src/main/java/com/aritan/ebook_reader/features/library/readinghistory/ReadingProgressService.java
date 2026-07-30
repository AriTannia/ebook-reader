package com.aritan.ebook_reader.features.library.readinghistory;

import com.aritan.ebook_reader.common.constants.messages.library.BookContentMessage;
import com.aritan.ebook_reader.common.constants.messages.library.ReadingProgressMessage;
import com.aritan.ebook_reader.common.enums.book.LibraryAccessStatus;
import com.aritan.ebook_reader.common.enums.book.ReadingStatus;
import com.aritan.ebook_reader.common.exception.InvalidRequestException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.ReadingProgress;
import com.aritan.ebook_reader.common.models.order.OrderItem;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.book.repositories.IBookRepository;
import com.aritan.ebook_reader.features.library.IUserLibraryRepository;
import com.aritan.ebook_reader.features.library.dtos.ReadingProgressResponse;
import com.aritan.ebook_reader.features.library.dtos.SaveProgressRequest;
import com.aritan.ebook_reader.features.library.utilities.ReadingProgressMapper;
import com.aritan.ebook_reader.features.user.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ReadingProgressService implements IReadingProgressService{
    private final IReadingProgressRepository readingProgressRepository;
    private final IUserLibraryRepository userLibraryRepository;
    private final IUserRepository userRepository;
    private final IBookRepository bookRepository;
    private final ReadingProgressMapper readingProgressMapper;
    @Override
    @Transactional
    public ReadingProgressResponse saveProgress(Long userId, SaveProgressRequest request) {
        boolean hasAccess = userLibraryRepository
                .existsByUser_UserIdAndBook_BookIdAndAccessStatus(
                        userId, request.getBookId(), LibraryAccessStatus.ACTIVE);

        if(!hasAccess){
            throw new InvalidRequestException(
                    String.format(BookContentMessage.USER_ACCESS_DENIED, userId, request.getBookId())
            );
        }

        readingProgressRepository.upsertProgress(
                userId,
                request.getBookId(),
                request.getLocator(),
                request.getProgressPercent(),
                LocalDateTime.now()
        );

        ReadingProgress progress = readingProgressRepository
                .findByUser_UserIdAndBook_BookId(userId, request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(ReadingProgressMessage.READING_PROGRESS_NOT_FOUND, userId, request.getBookId())
                ));

        return readingProgressMapper.toResponse(progress);
    }

    @Override
    public List<ReadingProgressResponse> getRecentlyRead(Long userId, int limit) {
        Pageable pageable = PageRequest.ofSize(limit);

        return readingProgressRepository
                .findByUser_UserIdOrderByLastReadAtDesc(userId, pageable)
                .stream()
                .map(readingProgressMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void markAsFinished(Long userId, Long bookId) {
        ReadingProgress progress = readingProgressRepository
                .findByUser_UserIdAndBook_BookId(userId, bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(ReadingProgressMessage.READING_PROGRESS_NOT_FOUND, userId, bookId)));

        progress.setStatus(ReadingStatus.FINISHED);
        progress.setProgressPercent(BigDecimal.valueOf(100));
        progress.setFinishedAt(LocalDateTime.now());

        readingProgressRepository.save(progress);
    }

    @Override
    @Transactional
    public void resetProgressByBookId(Long bookId) {
        readingProgressRepository.deleteByBook_BookId(bookId);
    }

    @Override
    public void createReadingProgress(User user, OrderItem orderItem) {
        ReadingProgress progress = readingProgressMapper.toEntity(orderItem, user);
        readingProgressRepository.save(progress);
    }
}
