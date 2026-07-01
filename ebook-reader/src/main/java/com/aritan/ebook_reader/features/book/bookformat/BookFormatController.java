package com.aritan.ebook_reader.features.book.bookformat;

import com.aritan.ebook_reader.common.constants.messages.BookFormatMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.book.dtos.BookFormatCreateRequest;
import com.aritan.ebook_reader.features.book.dtos.BookFormatResponse;
import com.aritan.ebook_reader.features.book.dtos.BookFormatUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/books/{bookId}/formats")
public class BookFormatController {
    private final IBookFormatService bookFormatService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<BookFormatResponse>>> getBookFormats(@PathVariable Long bookId) {
        var result = bookFormatService.getBookFormatsByBookId(bookId);
        return ResponseEntity
                .ok(EBResponse.Success(
                        result,
                        String.format(BookFormatMessage.BOOK_FORMATS_RETRIEVED_SUCCESSFULLY, bookId)));
    }

    @GetMapping("{bookFormatId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<BookFormatResponse>> getBookFormat(@PathVariable Long bookId, @PathVariable Long bookFormatId) {
        var result = bookFormatService.getBookFormatById(bookId, bookFormatId);
        return ResponseEntity
                .ok(EBResponse.Success(
                        result,
                        String.format(BookFormatMessage.BOOK_FORMAT_RETRIEVED_SUCCESSFULLY, bookFormatId, bookId)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<BookFormatResponse>> createBookFormat(
            @PathVariable Long bookId, @RequestBody BookFormatCreateRequest request) {
        var result = bookFormatService.createBookFormat(bookId, request);
        return ResponseEntity
                .ok(EBResponse.Created(
                        result,
                        String.format(BookFormatMessage.BOOK_FORMAT_CREATED_SUCCESSFULLY, bookId)));
    }

    @PutMapping("{bookFormatId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<BookFormatResponse>> updateBookFormat(
            @PathVariable Long bookId, @PathVariable Long bookFormatId, @RequestBody BookFormatUpdateRequest request) {
        var result = bookFormatService.updateBookFormat(bookId, bookFormatId, request);
        return ResponseEntity
                .ok(EBResponse.Success(
                        result,
                        String.format(BookFormatMessage.BOOK_FORMAT_UPDATED_SUCCESSFULLY, bookFormatId, bookId)));
    }

    @DeleteMapping("{bookFormatId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deleteBookFormat(
            @PathVariable Long bookId, @PathVariable Long bookFormatId) {
        bookFormatService.deleteBookFormat(bookId, bookFormatId);
        return ResponseEntity
                .ok(EBResponse.Success(
                        null,
                        String.format(BookFormatMessage.BOOK_FORMAT_DELETED_SUCCESSFULLY, bookFormatId, bookId)));
    }
}
