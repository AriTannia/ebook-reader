package com.aritan.ebook_reader.features.library.readinghistory;

import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.library.dtos.BookReaderResponse;
import com.aritan.ebook_reader.features.library.dtos.ReadingProgressResponse;
import com.aritan.ebook_reader.features.library.dtos.SaveProgressRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reading-progress")
@RequiredArgsConstructor
public class ReadingProgressController {
    private final IReadingProgressService readingProgressService;
    private final IAuthService authService;

    @PutMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<ReadingProgressResponse>> saveProgress(
            @Valid @RequestBody SaveProgressRequest request){
        User user = authService.getCurrentUser();
        var result = readingProgressService.saveProgress(user.getUserId(), request);

        return ResponseEntity.ok(EBResponse.Success(result, "Reading progress saved successfully."));
    }

    @GetMapping("{bookId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<BookReaderResponse>> openBookForReading(
            @PathVariable Long bookId
    ){
        User user = authService.getCurrentUser();
        var result = readingProgressService.getBookForReading(user.getUserId(), bookId);

        return ResponseEntity.ok(EBResponse.Success(result, "Book retrieved successfully."));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<List<ReadingProgressResponse>>> getRecentlyRead(
            @RequestParam(defaultValue = "10") int limit
    ){
        User user = authService.getCurrentUser();
        var result = readingProgressService.getRecentlyRead(user.getUserId(), limit);

        return ResponseEntity.ok(EBResponse.Success(result, "Recently read books retrieved successfully."));
    }

    @PatchMapping("/{bookId}/finish")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> markAsFinished(
            @PathVariable Long bookId
    ){
        User user = authService.getCurrentUser();
        readingProgressService.markAsFinished(user.getUserId(), bookId);

        return ResponseEntity.ok(EBResponse.Success(null, "Book marked as finished."));
    }
}
