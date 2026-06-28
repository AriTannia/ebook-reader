package com.aritan.ebook_reader.features.review;

import com.aritan.ebook_reader.features.review.dtos.ReviewCreateRequest;
import com.aritan.ebook_reader.features.review.dtos.ReviewResponse;
import com.aritan.ebook_reader.features.review.dtos.ReviewUpdatedRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IReviewService {
    Page<ReviewResponse> getPagedReviews(Long bookId, Pageable pageable);

    Page<ReviewResponse> getBookReviewsByUserId(Long userId, Pageable pageable);

    ReviewResponse createReview(Long bookId, ReviewCreateRequest request);

    ReviewResponse updateReview(Long bookId, ReviewUpdatedRequest updateRequest, UUID reviewId);

    void deleteReview(Long bookId, UUID reviewId);

    ReviewResponse updateReviewHelpful(Long bookId, UUID reviewId);
}
