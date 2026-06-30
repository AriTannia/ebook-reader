package com.aritan.ebook_reader.features.book;

import com.aritan.ebook_reader.common.constants.messages.BookMessage;
import com.aritan.ebook_reader.common.enums.book.BookBadge;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.book.dtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/books")
public class BookController {
    private final IBookService bookService;

    // Public
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<BookResponse>>> getAllBooks(
            BookFilterRequest request,
            Pageable pageable,
            @RequestParam(required = false) BookBadge badge){
        var result = bookService.getPagedBooks(request, pageable, badge);

        return ResponseEntity.ok(EBResponse.Success(result, BookMessage.BOOKS_RETRIEVED_SUCCESSFULLY));
    }

    @GetMapping("{bookId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<BookDetailsResponse>> getBookById(@PathVariable Long bookId){
        var result = bookService.getBookById(bookId);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(BookMessage.BOOK_RETRIEVED_SUCCESSFULLY, bookId)));
    }


    // Admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<BookAdminResponse>>> getAllBooksForAdmin(
            BookFilterRequest request,
            Pageable pageable,
            @RequestParam(required = false) BookBadge badge){
        var result = bookService.searchBooks(request, pageable, badge);

        return ResponseEntity.ok(EBResponse.Success(result, BookMessage.BOOKS_RETRIEVED_SUCCESSFULLY));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<BookDetailsResponse>>> createBook(
            @RequestBody List<BookCreateRequest> requests){
        var result = bookService.createBook(requests);
        return ResponseEntity.ok(EBResponse.Created(result, BookMessage.BOOK_CREATED_SUCCESSFULLY));
    }

    @PutMapping("/{bookId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<BookDetailsResponse>> updateBook(
            @RequestBody BookUpdateRequest updateRequest,
            @PathVariable Long bookId){
        var result = bookService.updateBook(updateRequest, bookId);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(BookMessage.BOOK_UPDATED_SUCCESSFULLY, bookId)));
    }

    @DeleteMapping("{bookId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deleteBook(@PathVariable Long bookId){
        bookService.deleteBook(bookId);
        return ResponseEntity.ok(
                EBResponse.Success(null,
                        String.format(BookMessage.BOOK_DELETED_SUCCESSFULLY, bookId)));
    }
}
