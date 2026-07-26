package com.aritan.ebook_reader.features.book;

import com.aritan.ebook_reader.common.constants.messages.book.AuthorMessage;
import com.aritan.ebook_reader.common.constants.messages.book.BookMessage;
import com.aritan.ebook_reader.common.constants.messages.book.CategoryMessage;
import com.aritan.ebook_reader.common.constants.messages.book.PublisherMessage;
import com.aritan.ebook_reader.common.enums.book.BookBadge;
import com.aritan.ebook_reader.common.enums.book.BookStatus;
import com.aritan.ebook_reader.common.enums.outbox.FileSourceType;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.*;
import com.aritan.ebook_reader.common.models.outbox.FileDeletionOutbox;
import com.aritan.ebook_reader.config.s3.utilities.StorageUrlExtension;
import com.aritan.ebook_reader.features.author.IAuthorRepository;
import com.aritan.ebook_reader.features.book.dtos.*;
import com.aritan.ebook_reader.features.book.factory.BookFactory;
import com.aritan.ebook_reader.features.book.resolver.BookReferenceResolver;
import com.aritan.ebook_reader.features.book.utilities.BookSpecification;
import com.aritan.ebook_reader.features.book.utilities.BookMapper;
import com.aritan.ebook_reader.features.category.ICategoryRepository;
import com.aritan.ebook_reader.features.file.IFileDeletionOutboxRepository;
import com.aritan.ebook_reader.features.file.IFileService;
import com.aritan.ebook_reader.features.library.IUserLibraryRepository;
import com.aritan.ebook_reader.features.publisher.IPublisherRepository;
import com.aritan.ebook_reader.features.review.IReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookService implements IBookService{
    private final IBookRepository bookRepository;
    private final IUserLibraryRepository userLibraryRepository;
    private final IReviewRepository reviewRepository;
    private final IFileDeletionOutboxRepository fileDeletionOutboxRepository;
    private final BookReferenceResolver referenceResolver;
    private final BookFactory bookFactory;
    private final BookMapper bookMapper;
    private final IFileService fileService;
    private final StorageUrlExtension storageUrlExtension;
    private static final Logger logger = LoggerFactory.getLogger(BookService.class);

    @Override
    public Page<BookResponse> getAllBooks(
            BookFilterRequest request,
            Pageable pageable,
            BookBadge badge) {
        Specification<Book> spec = Specification
                .where(BookSpecification.hasAuthor(request.getAuthorIds()))
                .and(BookSpecification.hasCategory(request.getCategoryIds()))
                .and(BookSpecification.hasStatus(BookStatus.ACTIVE))
                .and(BookSpecification.hasPublisher(request.getPublisherId()))
                .and(BookSpecification.hasKeyword(request.getKeyword()))
                .and(BookSpecification.hasBadge(badge))
                .and(BookSpecification.hasTag(request.getTagIds()));

        Page<Book> books = bookRepository.findAll(spec, pageable);

        return books.map(book -> {
            BookResponse response = bookMapper.toBookResponse(book);
            response.setCoverImageUrl(storageUrlExtension.getPublicUrl(book.getCoverImageUrl()));
            return response;
        });
    }

    @Override
    public Page<BookResponse> getPagedBooks(
            BookFilterRequest request,
            Pageable pageable) {
        Specification<Book> spec = Specification
                .where(BookSpecification.hasAuthor(request.getAuthorIds()))
                .and(BookSpecification.hasCategory(request.getCategoryIds()))
                .and(BookSpecification.hasStatus(BookStatus.ACTIVE))
                .and(BookSpecification.hasPublisher(request.getPublisherId()))
                .and(BookSpecification.hasKeyword(request.getKeyword()))
                .and(BookSpecification.hasTag(request.getTagIds()));

        Page<Book> books = bookRepository.findAll(spec, pageable);

        return books.map(book -> {
            BookResponse response = bookMapper.toBookResponse(book);
            response.setCoverImageUrl(storageUrlExtension.getPublicUrl(book.getCoverImageUrl()));
            return response;
        });
    }

    @Override
    public Page<BookAdminResponse> searchBooks(BookFilterRequest request, Pageable pageable, BookBadge badge) {
        Specification<Book> spec = Specification
                .where(BookSpecification.hasAuthor(request.getAuthorIds()))
                .and(BookSpecification.hasCategory(request.getCategoryIds()))
                .and(BookSpecification.hasStatus(request.getStatus()))
                .and(BookSpecification.hasPublisher(request.getPublisherId()))
                .and(BookSpecification.hasKeyword(request.getKeyword()))
                .and(BookSpecification.hasBadge(badge));

        Page<Book> books = bookRepository.findAll(spec, pageable);

        return books.map(book -> {
            BookAdminResponse response = bookMapper.toAdminResponse(book);
            response.setCoverImageUrl(storageUrlExtension.getPublicUrl(book.getCoverImageUrl()));
            return response;
        });
    }

    @Override
    public BookDetailsResponse getBookById(Long userId, Long bookId) {
        Book book = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        boolean existedInLibrary = userLibraryRepository.existsByUser_UserIdAndBook_BookId(userId, bookId);
        boolean existedUserReview = reviewRepository.existsByUser_UserIdAndBook_BookId(userId, bookId);

        BookDetailsResponse response = bookMapper.toDetailsResponse(book);
        response.setCoverImageUrl(storageUrlExtension.getPublicUrl(book.getCoverImageUrl()));
        response.setExistedInLibrary(existedInLibrary);
        response.setExistedUserReview(existedUserReview);
        return response;
    }

    @Override
    public List<BookAdminResponse> createBook(List<BookCreateRequest> requests) {
        BookReferenceContext context = referenceResolver.resolve(requests);

        List<Book> books = requests.stream()
                .map(request -> bookFactory.create(request, context))
                .toList();

        List<Book> savedBooks = bookRepository.saveAll(books);

        return savedBooks.stream()
                .map(book -> {
                    BookAdminResponse response = bookMapper.toAdminResponse(book);
                    response.setCoverImageUrl(storageUrlExtension.getPublicUrl(book.getCoverImageUrl()));
                    return response;
                })
                .toList();
    }

    @Override
    @Transactional
    public BookAdminResponse updateBook(BookUpdateRequest updateRequest, Long bookId) {
        Book existedBook = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        String oldCoverImgUrl = existedBook.getCoverImageUrl();

        BookReferenceContext context = referenceResolver.resolve(updateRequest);
        Book book = bookFactory.update(existedBook, updateRequest, context);

        book.setBookId(existedBook.getBookId());

        Book savedBook = bookRepository.save(existedBook);

        if(oldCoverImgUrl != null && !oldCoverImgUrl.equals(updateRequest.getCoverImageUrl())) {
            FileDeletionOutbox outbox = new FileDeletionOutbox();

            outbox.setFileUrl(oldCoverImgUrl);
            outbox.setSourceType(FileSourceType.BOOK_COVER);
            outbox.setSourceEntityId(bookId);

            fileDeletionOutboxRepository.save(outbox);
        }

        BookAdminResponse response = bookMapper.toAdminResponse(savedBook);
        response.setCoverImageUrl(storageUrlExtension.getPublicUrl(savedBook.getCoverImageUrl()));
        return response;
    }

    @Override
    public void deleteBook(Long bookId) {
        Book existedBook = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        bookRepository.delete(existedBook);

        if(existedBook.getCoverImageUrl() != null){
            fileService.deleteFile(existedBook.getCoverImageUrl());
        }
    }
}
