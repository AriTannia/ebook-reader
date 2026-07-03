package com.aritan.ebook_reader.features.library;

import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.library.dtos.LibraryFilterRequest;
import com.aritan.ebook_reader.features.library.dtos.UserLibraryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
public class UserLibraryController {
    private final IUserLibraryService userLibraryService;
    private final IAuthService authService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<UserLibraryResponse>>> getMyLibrary(
            LibraryFilterRequest filter,
            Pageable pageable) {
        User user = authService.getCurrentUser();
        var result = userLibraryService.getMyLibrary(user.getUserId(), filter, pageable);

        return ResponseEntity.ok(EBResponse.Success(result, ""));
    }

    @GetMapping("/{bookId}/access")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Boolean>> checkAccess(
            @PathVariable Long bookId) {
        User user = authService.getCurrentUser();
        boolean access = userLibraryService.hasAccess(user.getUserId(), bookId);

        return ResponseEntity.ok(EBResponse.Success(access, ""));
    }

    @PatchMapping("/{bookId}/favorite")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> toggleFavorite(
            @PathVariable Long bookId,
            @RequestParam boolean isFavorite) {
        User user = authService.getCurrentUser();
        userLibraryService.toggleFavorite(user.getUserId(), bookId, isFavorite);

        return ResponseEntity.ok(EBResponse.Success(null, ""));
    }

    // Admin only
    @PostMapping("/admin/{userId}/books/{bookId}/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> revokeAccess(
            @PathVariable Long userId,
            @PathVariable Long bookId,
            @RequestParam String reason) {
        userLibraryService.revokeAccess(userId, bookId, reason);

        return ResponseEntity.ok(EBResponse.Success(null, ""));
    }
}
