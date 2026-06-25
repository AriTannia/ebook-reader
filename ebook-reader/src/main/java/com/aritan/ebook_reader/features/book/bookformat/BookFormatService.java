package com.aritan.ebook_reader.features.book.bookformat;

import com.aritan.ebook_reader.common.constants.messages.BookFormatMessage;
import com.aritan.ebook_reader.common.constants.messages.BookMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.Book;
import com.aritan.ebook_reader.common.models.BookFormat;
import com.aritan.ebook_reader.features.book.IBookRepository;
import com.aritan.ebook_reader.features.book.dtos.BookFormatCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookFormatResponse;
import com.aritan.ebook_reader.features.book.dtos.BookFormatUpdateRequest;
import com.aritan.ebook_reader.features.book.utilities.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookFormatService implements IBookFormatService {
    private final IBookFormatRepository bookFormatRepository;
    private final IBookRepository bookRepository;
    private final BookMapper bookMapper;

    @Override
    public List<BookFormatResponse> getBookFormatsByBookId(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        List<BookFormat> bookFormats = bookFormatRepository.findAllByBook_BookId(bookId);
        return bookFormats.stream()
                .map(bookMapper::toFormatResponse).toList();
    }

    @Override
    public BookFormatResponse getBookFormatById(Long bookId, Long bookFormatId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        BookFormat bookFormat = bookFormatRepository.findById(bookFormatId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookFormatMessage.BOOK_FORMAT_NOT_FOUND, bookFormatId)
                ));
        return bookMapper.toFormatResponse(bookFormat);
    }

    @Override
    public BookFormatResponse createBookFormat(Long bookId, BookFormatCreateRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        BookFormat bookFormat = bookMapper.toBookFormat(request);
        bookFormat.setBook(book);
        bookFormatRepository.save(bookFormat);

        return bookMapper.toFormatResponse(bookFormat);
    }

    @Override
    @Transactional
    public BookFormatResponse updateBookFormat(Long bookId, Long bookFormatId, BookFormatUpdateRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        BookFormat bookFormat = bookFormatRepository.findById(bookFormatId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookFormatMessage.BOOK_FORMAT_NOT_FOUND, bookFormatId)
                ));

        bookMapper.updateBookFormat(request, bookFormat);
        BookFormat savedBookFormat = bookFormatRepository.save(bookFormat);

        return bookMapper.toFormatResponse(savedBookFormat);
    }

    @Override
    public void deleteBookFormat(Long bookId, Long bookFormatId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        BookFormat bookFormat = bookFormatRepository.findById(bookFormatId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookFormatMessage.BOOK_FORMAT_NOT_FOUND, bookFormatId)
                ));

        bookFormatRepository.delete(bookFormat);
    }
}
