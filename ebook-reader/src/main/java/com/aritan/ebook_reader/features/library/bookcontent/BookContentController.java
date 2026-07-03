package com.aritan.ebook_reader.features.library.bookcontent;

import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.auth.IAuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookContentController {
    private final IBookContentService bookContentService;
    private final IAuthService authService;

    @GetMapping("/{bookId}/stream")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public void streamPdf(
            @PathVariable Long bookId,
            @RequestHeader HttpHeaders headers,
            HttpServletResponse response) {
        User user = authService.getCurrentUser();
        bookContentService.streamPdf(user.getUserId(), bookId, headers, response);
    }

    @GetMapping("/{bookId}/content-url")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<String>> getContentUrl(@PathVariable Long bookId) {
        User user = authService.getCurrentUser();
        String url = bookContentService.getDirectContentUrl(user.getUserId(), bookId);
        return ResponseEntity.ok(EBResponse.Success(url, ""));
    }
}
