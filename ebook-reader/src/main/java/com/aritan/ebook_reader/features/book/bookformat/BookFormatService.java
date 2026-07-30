package com.aritan.ebook_reader.features.book.bookformat;

import com.aritan.ebook_reader.common.constants.messages.book.BookFormatMessage;
import com.aritan.ebook_reader.common.constants.messages.book.BookMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.BookFormat;
import com.aritan.ebook_reader.features.book.repositories.IBookRepository;
import com.aritan.ebook_reader.features.book.dtos.BookFormatCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookFormatResponse;
import com.aritan.ebook_reader.features.book.utilities.BookMapper;
import com.aritan.ebook_reader.features.file.IFileService;
import com.aritan.ebook_reader.features.library.readinghistory.IReadingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookFormatService implements IBookFormatService {
    private final IBookFormatRepository bookFormatRepository;
    private final IBookRepository bookRepository;
    private final IFileService fileService;
    private final IReadingProgressService readingProgressService;
    private final BookMapper bookMapper;

    @Override
    public List<BookFormatResponse> getBookFormatsByBookId(Long bookId) {
        bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        List<BookFormat> bookFormats = bookFormatRepository.findAllByBook_BookId(bookId);
        return bookFormats.stream()
                .map(bookMapper::toFormatResponse).toList();
    }

    @Override
    public BookFormatResponse getBookFormatById(Long bookId, Long bookFormatId) {
        Book book = bookRepository.findByBookId(bookId)
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
    @Transactional
    public BookFormatResponse createBookFormat(Long bookId, BookFormatCreateRequest request) {
        Book book = bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        boolean isPrimary = bookFormatRepository.existsByBook_BookIdAndIsPrimaryTrue(bookId);

        BookFormat bookFormat = bookMapper.toBookFormat(request);
        bookFormat.setBook(book);

        if(!isPrimary){
            bookFormat.setIsPrimary(true);
        }

        bookFormatRepository.save(bookFormat);

        return bookMapper.toFormatResponse(bookFormat);
    }

    @Override
    @Transactional
    public BookFormatResponse updateIsPrimaryFormat(
            Long bookId,
            Long bookFormatId,
            boolean isPrimary) {
        if(!bookRepository.existsById(bookId)){
            throw new ResourceNotFoundException(String.format(BookMessage.BOOK_NOT_FOUND, bookId));
        }

        BookFormat bookFormat = bookFormatRepository.findById(bookFormatId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookFormatMessage.BOOK_FORMAT_NOT_FOUND, bookFormatId)
                ));

        BookFormat existedPrimaryFormat = bookFormatRepository.findByBook_BookIdAndIsPrimaryTrue(bookId)
                .orElse(null);

        if(existedPrimaryFormat != null && bookFormatId.equals(existedPrimaryFormat.getBookFormatId())){
            return bookMapper.toFormatResponse(bookFormat);
        }

        if(existedPrimaryFormat != null && existedPrimaryFormat.getIsPrimary()){

            existedPrimaryFormat.setIsPrimary(false);
            bookFormatRepository.saveAndFlush(existedPrimaryFormat);
        }

        bookFormat.setIsPrimary(isPrimary);
        BookFormat savedBookFormat = bookFormatRepository.save(bookFormat);

        readingProgressService.resetProgressByBookId(bookId);

        return bookMapper.toFormatResponse(savedBookFormat);
    }

    @Override
    @Transactional
    public void deleteBookFormat(Long bookId, Long bookFormatId) {
        bookRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookMessage.BOOK_NOT_FOUND, bookId)
                ));

        BookFormat bookFormat = bookFormatRepository.findById(bookFormatId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(BookFormatMessage.BOOK_FORMAT_NOT_FOUND, bookFormatId)
                ));

        bookFormatRepository.delete(bookFormat);

        String fileUrl = bookFormat.getStorageUrl();
        if(fileUrl != null){
            fileService.deleteFile(fileUrl);
        }
    }
}
