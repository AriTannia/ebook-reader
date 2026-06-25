package com.aritan.ebook_reader.features.book;

import com.aritan.ebook_reader.common.constants.messages.AuthorMessage;
import com.aritan.ebook_reader.common.constants.messages.BookMessage;
import com.aritan.ebook_reader.common.constants.messages.CategoryMessage;
import com.aritan.ebook_reader.common.constants.messages.PublisherMessage;
import com.aritan.ebook_reader.common.enums.BookStatus;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.Author;
import com.aritan.ebook_reader.common.models.Book;
import com.aritan.ebook_reader.common.models.Category;
import com.aritan.ebook_reader.common.models.Publisher;
import com.aritan.ebook_reader.features.author.IAuthorRepository;
import com.aritan.ebook_reader.features.book.dtos.*;
import com.aritan.ebook_reader.features.book.factory.BookFactory;
import com.aritan.ebook_reader.features.book.resolver.BookReferenceResolver;
import com.aritan.ebook_reader.features.book.utilities.BookSpecification;
import com.aritan.ebook_reader.features.book.utilities.BookMapper;
import com.aritan.ebook_reader.features.category.ICategoryRepository;
import com.aritan.ebook_reader.features.publisher.IPublisherRepository;
import lombok.RequiredArgsConstructor;
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

    @Override
    public Page<BookResponse> getPagedBooks(BookFilterRequest request, Pageable pageable) {
        Specification<Book> spec = Specification
                .where(BookSpecification.hasAuthor(request.getAuthorId()))
                .and(BookSpecification.hasCategory(request.getCategoryId()))
                .and(BookSpecification.hasStatus(BookStatus.ACTIVE))
                .and(BookSpecification.hasPublisher(request.getPublisherId()))
                .and(BookSpecification.hasKeyword(request.getKeyword()));

        Page<Book> books = bookRepository.findAll(spec, pageable);

        return books.map(bookMapper::toBookResponse);
    }

    @Override
    public BookDetailsResponse getBookById(Long bookId) {
        Book book = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        return bookMapper.toDetailsResponse(book);
    }

    @Override
    public List<BookDetailsResponse> createBook(List<BookCreateRequest> requests) {
        BookReferenceContext context = referenceResolver.resolve(requests);

        List<Book> books = requests.stream()
                .map(request -> bookFactory.create(request, context))
                .toList();

        List<Book> savedBooks = bookRepository.saveAll(books);

        return savedBooks.stream()
                .map(bookMapper::toDetailsResponse)
                .toList();
    }

    @Override
    @Transactional
    public BookDetailsResponse updateBook(BookUpdateRequest updateRequest, Long bookId) {
        Book existedBook = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

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

        existedBook.setAuthors(authors);
        existedBook.setCategories(categories);
        existedBook.setPublisher(publisher);

        Book savedBook = bookRepository.save(existedBook);

        return bookMapper.toDetailsResponse(savedBook);
    }

    @Override
    public void deleteBook(Long bookId) {
        Book existedBook = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        bookRepository.delete(existedBook);
    }
}
