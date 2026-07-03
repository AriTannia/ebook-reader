package com.aritan.ebook_reader.features.book;

import com.aritan.ebook_reader.common.constants.messages.book.AuthorMessage;
import com.aritan.ebook_reader.common.constants.messages.book.BookMessage;
import com.aritan.ebook_reader.common.constants.messages.book.CategoryMessage;
import com.aritan.ebook_reader.common.constants.messages.book.PublisherMessage;
import com.aritan.ebook_reader.common.enums.book.BookBadge;
import com.aritan.ebook_reader.common.enums.book.BookStatus;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Author;
import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.Category;
import com.aritan.ebook_reader.common.models.book.Publisher;
import com.aritan.ebook_reader.features.author.IAuthorRepository;
import com.aritan.ebook_reader.features.book.dtos.*;
import com.aritan.ebook_reader.features.book.factory.BookFactory;
import com.aritan.ebook_reader.features.book.resolver.BookReferenceResolver;
import com.aritan.ebook_reader.features.book.utilities.BookSpecification;
import com.aritan.ebook_reader.features.book.utilities.BookMapper;
import com.aritan.ebook_reader.features.category.ICategoryRepository;
import com.aritan.ebook_reader.features.file.IFileService;
import com.aritan.ebook_reader.features.publisher.IPublisherRepository;
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
    private final IAuthorRepository authorRepository;
    private final ICategoryRepository categoryRepository;
    private final IPublisherRepository publisherRepository;
    private final BookReferenceResolver referenceResolver;
    private final BookFactory bookFactory;
    private final BookMapper bookMapper;
    private final IFileService fileService;
    private static final Logger logger = LoggerFactory.getLogger(BookService.class);

    @Override
    public Page<BookResponse> getPagedBooks(
            BookFilterRequest request,
            Pageable pageable,
            BookBadge badge) {
        Specification<Book> spec = Specification
                .where(BookSpecification.hasAuthor(request.getAuthorId()))
                .and(BookSpecification.hasCategory(request.getCategoryId()))
                .and(BookSpecification.hasStatus(BookStatus.ACTIVE))
                .and(BookSpecification.hasPublisher(request.getPublisherId()))
                .and(BookSpecification.hasKeyword(request.getKeyword()))
                .and(BookSpecification.hasBadge(badge));

        Page<Book> books = bookRepository.findAll(spec, pageable);

        return books.map(bookMapper::toBookResponse);
    }

    @Override
    public Page<BookAdminResponse> searchBooks(BookFilterRequest request, Pageable pageable, BookBadge badge) {
        Specification<Book> spec = Specification
                .where(BookSpecification.hasAuthor(request.getAuthorId()))
                .and(BookSpecification.hasCategory(request.getCategoryId()))
                .and(BookSpecification.hasStatus(BookStatus.ACTIVE))
                .and(BookSpecification.hasPublisher(request.getPublisherId()))
                .and(BookSpecification.hasKeyword(request.getKeyword()))
                .and(BookSpecification.hasBadge(badge));

        Page<Book> books = bookRepository.findAll(spec, pageable);

        return books.map(bookMapper::toAdminResponse);
    }

    @Override
    public BookDetailsResponse getBookById(Long bookId) {
        Book book = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        logger.info("DTMBP: {}", book.getTags());

        return bookMapper.toDetailsResponse(book);
    }

    @Override
    public List<BookAdminResponse> createBook(List<BookCreateRequest> requests) {
        BookReferenceContext context = referenceResolver.resolve(requests);

        List<Book> books = requests.stream()
                .map(request -> bookFactory.create(request, context))
                .toList();

        List<Book> savedBooks = bookRepository.saveAll(books);

        return savedBooks.stream()
                .map(bookMapper::toAdminResponse)
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

        Set<Author> authors = new HashSet<>(
                authorRepository.findAllById(updateRequest.getAuthorIds())
        );

        Set<Category> categories = new HashSet<>(
                categoryRepository.findAllById(updateRequest.getCategoryIds()));

        if (authors.size() != updateRequest.getAuthorIds().size()) {
            throw new ResourceNotFoundException(AuthorMessage.SOME_AUTHORS_NOT_FOUND);
        }

        if (categories.size() != updateRequest.getCategoryIds().size()) {
            throw new ResourceNotFoundException(CategoryMessage.SOME_CATEGORIES_NOT_FOUND);
        }

        Publisher publisher = publisherRepository.findById(updateRequest.getPublisherId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(PublisherMessage.PUBLISHER_NOT_FOUND, updateRequest.getPublisherId())));

        bookMapper.updateBook(updateRequest, existedBook);

        existedBook.setBookId(bookId);
        existedBook.setAuthors(authors);
        existedBook.setCategories(categories);
        existedBook.setPublisher(publisher);

        Book savedBook = bookRepository.save(existedBook);

        if(oldCoverImgUrl != null && oldCoverImgUrl.equals(updateRequest.getCoverImageUrl())) {
            // delete old cover image file
            fileService.deleteFile(oldCoverImgUrl);
        }

        return bookMapper.toAdminResponse(savedBook);
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
