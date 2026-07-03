package com.aritan.ebook_reader.features.library.bookcontent;

import com.aritan.ebook_reader.common.enums.FormatType;
import com.aritan.ebook_reader.common.exception.AccessDeniedException;
import com.aritan.ebook_reader.common.exception.IllegalStateException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.exception.TooManyRequestsException;
import com.aritan.ebook_reader.common.models.book.BookFormat;
import com.aritan.ebook_reader.features.book.bookformat.IBookFormatRepository;
import com.aritan.ebook_reader.features.file.IFileService;
import com.aritan.ebook_reader.features.library.IUserLibraryService;
import com.aritan.ebook_reader.features.library.bookcontent.limiter.BookContentRateLimiter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class BookContentService implements IBookContentService{
    private final IUserLibraryService userLibraryService;
    private final IBookFormatRepository bookFormatRepository;
    private final IFileService fileService;
    private final BookContentRateLimiter rateLimiter;

    private static final Duration SIGNED_URL_TTL = Duration.ofMinutes(5);
    @Override
    public void streamPdf(Long userId, Long bookId, HttpHeaders requestHeaders, HttpServletResponse response) {
        BookFormat bookFormat = getAccessibleBook(userId, bookId);

        if(bookFormat.getFormatType() == FormatType.PDF){
            throw new AccessDeniedException("Book " + bookId + " is a PDF, use stream endpoint instead");
        }

        fileService.streamWithRange(bookFormat.getStorageUrl(), requestHeaders, response);
    }

    @Override
    public String getDirectContentUrl(Long userId, Long bookId) {
        if(rateLimiter.tryConsume(userId)){
            throw new TooManyRequestsException(
                    "Too many requests for user " + userId + ". Please try again later.");
        }

        BookFormat bookFormat = getAccessibleBook(userId, bookId);

        if(bookFormat.getFormatType() == FormatType.PDF){
            throw new IllegalStateException("Book " + bookId + " is a PDF, use stream endpoint instead");
        }

        return fileService.generatePrivatePresignedUrl(bookFormat.getStorageUrl(), SIGNED_URL_TTL);
    }

    private BookFormat getAccessibleBook(Long userId, Long bookId){
        if(!userLibraryService.hasAccess(userId, bookId)){
            throw new AccessDeniedException("User does not have access to this book.");
        }

        return bookFormatRepository.findByBookId(bookId)
                .stream().filter(format -> format.getMimeType().equals("application/pdf"))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("PDF format not found for this book."));
    }
}
