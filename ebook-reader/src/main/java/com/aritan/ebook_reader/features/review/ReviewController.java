package com.aritan.ebook_reader.features.review;

import com.aritan.ebook_reader.common.constants.messages.book.ReviewMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.review.dtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ReviewController {
    private final IReviewService reviewService;
    private final IAuthService authService;

    @GetMapping("/books/{bookId}/reviews")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<ReviewResponse>>> getAllReviews(
            @PathVariable Long bookId, Pageable pageable){
        var result = reviewService.getPagedReviews(bookId, pageable);

        return ResponseEntity.ok(EBResponse.Success(result, ReviewMessage.REVIEWS_RETRIEVED_SUCCESSFULLY));
    }

    @GetMapping("/users/{userId}/reviews")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<ReviewResponse>>> getReviewsByUserId(
            @PathVariable Long userId, Pageable pageable){
        var result = reviewService.getBookReviewsByUserId(userId, pageable);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(ReviewMessage.REVIEW_RETRIEVED_SUCCESSFULLY, userId)));
    }

    @GetMapping("/books/{bookId}/reviews/stats")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<ReviewStatsResponse>> getReviewStats(
            @PathVariable Long bookId){
        var result = reviewService.getReviewStats(bookId);
        return ResponseEntity.ok(EBResponse.Success(result, ReviewMessage.REVIEW_STATS_RETRIEVED_SUCCESSFULLY));
    }

    @PostMapping("/books/{bookId}/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<ReviewResponse>> createReview(
            @PathVariable Long bookId, @RequestBody ReviewCreateRequest request){
        User user = authService.getCurrentUser();

        var result = reviewService.createReview(user, bookId, request);
        return ResponseEntity.ok(EBResponse.Created(result, ReviewMessage.REVIEW_CREATED_SUCCESSFULLY));
    }

    @PutMapping("/books/{bookId}/reviews/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<ReviewResponse>> updateReview(
            @PathVariable Long bookId,
            @RequestBody ReviewUpdatedRequest updateRequest,
            @PathVariable UUID reviewId){
        User user = authService.getCurrentUser();
        var result = reviewService.updateReview(user, bookId, updateRequest, reviewId);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(ReviewMessage.REVIEW_UPDATED_SUCCESSFULLY, reviewId)));
    }

    @PutMapping("/books/{bookId}/reviews/{reviewId}/helpful")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<ReviewResponse>> updateReviewHelpful(
            @PathVariable Long bookId,
            @PathVariable UUID reviewId){
        var result = reviewService.updateReviewHelpful(bookId, reviewId);
        return ResponseEntity.ok(
                EBResponse.Success(result,
                        String.format(ReviewMessage.REVIEW_UPDATED_SUCCESSFULLY, reviewId)));
    }

    @DeleteMapping("/books/{bookId}/reviews/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deleteReview(
            @PathVariable Long bookId, @PathVariable UUID reviewId){
        reviewService.deleteReview(bookId, reviewId);
        return ResponseEntity.ok(
                EBResponse.Success(null,
                        String.format(ReviewMessage.REVIEW_DELETED_SUCCESSFULLY, reviewId)));
    }
}
