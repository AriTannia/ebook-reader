package com.aritan.ebook_reader.features.library.bookcontent;

import com.aritan.ebook_reader.common.constants.messages.library.BookContentMessage;
import com.aritan.ebook_reader.common.enums.book.FormatType;
import com.aritan.ebook_reader.common.exception.*;
import com.aritan.ebook_reader.common.exception.IllegalStateException;
import com.aritan.ebook_reader.common.models.book.BookFormat;
import com.aritan.ebook_reader.features.book.bookformat.IBookFormatRepository;
import com.aritan.ebook_reader.features.file.IFileService;
import com.aritan.ebook_reader.features.library.IUserLibraryService;
import com.aritan.ebook_reader.features.library.bookcontent.limiter.BookContentRateLimiter;
import com.aritan.ebook_reader.features.library.dtos.BookContentFormatResponse;
import com.aritan.ebook_reader.features.library.utilities.BookContentMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookContentService implements IBookContentService{
    private final IUserLibraryService userLibraryService;
    private final IBookFormatRepository bookFormatRepository;
    private final IFileService fileService;
    private final BookContentRateLimiter rateLimiter;
    private final BookContentMapper contentMapper;

    private static final Duration SIGNED_URL_TTL = Duration.ofMinutes(5);
    private static final Logger logger = LoggerFactory.getLogger(BookContentService.class);
    @Override
    public void streamPdf(Long userId, Long bookId, HttpHeaders requestHeaders, HttpServletResponse response) {
        BookFormat bookFormat = getAccessibleBookFormat(userId, bookId, FormatType.PDF);

        if(bookFormat.getFormatType() != FormatType.PDF){
            throw new AccessDeniedException(
                    String.format(BookContentMessage.PDF_STREAM_ONLY, bookId)
            );
        }

        fileService.streamWithRange(bookFormat.getStorageUrl(), requestHeaders, response);
    }

    @Override
    public String getDirectContentUrl(Long userId, Long bookId) {
        if(!rateLimiter.tryConsume(userId)){
            throw new TooManyRequestsException(
                    String.format(BookContentMessage.TOO_MANY_REQUESTS, userId));
        }

        BookFormat bookFormat = getAccessibleBookFormat(userId, bookId, null);

        if(bookFormat.getFormatType() == FormatType.PDF){
            throw new IllegalStateException(String.format(BookContentMessage.PDF_STREAM_ONLY, bookId));
        }

        return fileService.generateReadingPresignedUrl(bookFormat.getStorageUrl(), SIGNED_URL_TTL);
    }

    @Override
    public BookContentFormatResponse getBookFormatForReading(Long userId, Long bookId) {
       BookFormat bookFormat = getisPrimaryBookFormat(userId, bookId);

       return contentMapper.toBookReaderResponse(bookFormat);
    }

    private BookFormat getAccessibleBookFormat(Long userId, Long bookId, FormatType formatType) {
        if (!userLibraryService.hasAccess(userId, bookId)) {
            throw new AccessDeniedException(String.format(
                    BookContentMessage.USER_ACCESS_DENIED, userId, bookId));
        }

        List<BookFormat> formats = bookFormatRepository.findAllByBook_BookId(bookId);

        if (formatType == FormatType.PDF) {
            return formats.stream()
                    .filter(format -> format.getFormatType() == FormatType.PDF)
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException(String.format(
                            BookContentMessage.BOOK_FORMAT_NOT_FOUND, bookId, FormatType.PDF)));
        }

        // EPUB/TXT
        return formats.stream()
                .filter(format -> format.getFormatType() != FormatType.PDF)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(String.format(
                        BookContentMessage.BOOK_FORMAT_NOT_FOUND, bookId, FormatType.EPUB)));
    }

    private BookFormat getisPrimaryBookFormat(Long userId, Long bookId){
        if(!userLibraryService.hasAccess(userId, bookId)){
            throw new AccessDeniedException(String.format(
                    BookContentMessage.USER_ACCESS_DENIED, userId, bookId));
        }

        return bookFormatRepository.findByBook_BookIdAndIsPrimaryTrue(bookId)
                .orElseThrow(() -> new InvalidRequestException(String.format(
                        BookContentMessage.PRIMARY_FORMAT_NOT_FOUND, bookId)));
    }
}
