package com.aritan.ebook_reader.features.review;

import com.aritan.ebook_reader.common.constants.messages.ReviewMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.review.dtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ReviewController {
    private final IReviewService reviewService;

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

    @PostMapping("/books/{bookId}/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<ReviewResponse>> createReview(
            @PathVariable Long bookId, @RequestBody ReviewCreateRequest request){
        var result = reviewService.createReview(bookId, request);
        return ResponseEntity.ok(EBResponse.Created(result, ReviewMessage.REVIEW_CREATED_SUCCESSFULLY));
    }

    @PutMapping("/books/{bookId}/reviews/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<ReviewResponse>> updateReview(
            @PathVariable Long bookId,
            @RequestBody ReviewUpdatedRequest updateRequest,
            @PathVariable UUID reviewId){
        var result = reviewService.updateReview(bookId, updateRequest, reviewId);
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
