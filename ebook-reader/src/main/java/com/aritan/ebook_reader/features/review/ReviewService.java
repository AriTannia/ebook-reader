package com.aritan.ebook_reader.features.review;

import com.aritan.ebook_reader.common.constants.messages.book.BookMessage;
import com.aritan.ebook_reader.common.constants.messages.book.ReviewMessage;
import com.aritan.ebook_reader.common.constants.rules.ReviewRatings;
import com.aritan.ebook_reader.common.exception.AccessDeniedException;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Review;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.config.s3.utilities.StorageUrlExtension;
import com.aritan.ebook_reader.features.book.repositories.IBookRepository;
import com.aritan.ebook_reader.features.review.dtos.*;
import com.aritan.ebook_reader.features.review.utilities.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final IReviewRepository reviewRepository;
    private final IBookRepository bookRepository;
    private final StorageUrlExtension storageUrlExtension;
    private final ReviewMapper reviewMapper;
    @Override
    public Page<ReviewResponse> getPagedReviews(Long bookId,  Pageable pageable) {
        Page<Review> reviews = reviewRepository.findAllByBook_BookId(bookId, pageable);

        return reviews.map(review -> {
            ReviewResponse response = reviewMapper.toReviewResponse(review);
            response.getUser().setAvatarUrl(storageUrlExtension.getPublicUrl(review.getUser().getAvatarUrl()));
            return response;
        });
    }

    @Override
    public Page<ReviewResponse> getBookReviewsByUserId(Long userId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findAllByUser_UserId(userId, pageable);

        return reviews.map(review -> {
            ReviewResponse response = reviewMapper.toReviewResponse(review);
            response.getUser().setAvatarUrl(storageUrlExtension.getPublicUrl(review.getUser().getAvatarUrl()));
            return response;
        });
    }

    @Override
    @Transactional
    public ReviewResponse createReview(User user, Long bookId, ReviewCreateRequest request) {
        boolean existedUserReview = reviewRepository.existsByUser_UserIdAndBook_BookId(user.getUserId(), bookId);
        if (existedUserReview) {
            throw new ResourceNotFoundException(ReviewMessage.REVIEW_ALREADY_EXISTS);
        }

        Review review = reviewMapper.toEntity(request);
        review.setBook(bookRepository.getReferenceById(bookId));
        review.setUser(user);

        try {
            reviewRepository.save(review);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceNotFoundException(ReviewMessage.REVIEW_ALREADY_EXISTS);
        }

        review.getUser().setAvatarUrl(storageUrlExtension.getPublicUrl(review.getUser().getAvatarUrl()));
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(
            User user,
            Long bookId,
            ReviewUpdatedRequest updateRequest,
            UUID reviewId) {

        Review review = reviewRepository.findByReviewIdAndBook_BookId(reviewId, bookId)
                .orElseThrow(() -> new ResourceNotFoundException(ReviewMessage.REVIEW_NOT_FOUND));

        if (!review.getUser().getUserId().equals(user.getUserId())) {
            throw new AccessDeniedException(
                    ReviewMessage.NOT_ALLOWED
            );
        }

        reviewMapper.toEntity(updateRequest, review);
        review.setBook(bookRepository.getReferenceById(bookId));
        review.setUser(user);

        reviewRepository.save(review);

        review.getUser().setAvatarUrl(storageUrlExtension.getPublicUrl(review.getUser().getAvatarUrl()));
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long bookId, UUID reviewId) {
        boolean isExistedBook = bookRepository.existsByBookId(bookId);
        if(!isExistedBook){
            throw new ResourceNotFoundException(BookMessage.BOOK_NOT_FOUND);
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(ReviewMessage.REVIEW_NOT_FOUND));

        reviewRepository.delete(review);
    }

    @Override
    @Transactional
    public ReviewResponse updateReviewHelpful(Long bookId, UUID reviewId) {
        boolean isExistedBook = bookRepository.existsByBookId(bookId);
        if(!isExistedBook){
            throw new ResourceNotFoundException(BookMessage.BOOK_NOT_FOUND);
        }

        Review review = reviewRepository.findByReviewIdAndBook_BookId(reviewId, bookId)
                .orElseThrow(() -> new ResourceNotFoundException(ReviewMessage.REVIEW_NOT_FOUND));

        review.setHelpfulCount(review.getHelpfulCount() + 1);
        reviewRepository.save(review);

        review.getUser().setAvatarUrl(storageUrlExtension.getPublicUrl(review.getUser().getAvatarUrl()));
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    public ReviewStatsResponse getReviewStats(Long bookId){
        boolean isExistedBook = bookRepository.existsByBookId(bookId);
        if(!isExistedBook){
            throw new ResourceNotFoundException(BookMessage.BOOK_NOT_FOUND);
        }

        List<RatingCountProjection> ratingCounts = reviewRepository.countRatingsByBookId(bookId);

        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int i = ReviewRatings.MAX_RATING; i >= ReviewRatings.MIN_RATING; i--){
            distribution.put(i, 0L);
        }

        long total = 0;
        double weightedSum = 0;
        for (RatingCountProjection p : ratingCounts){
            distribution.put(p.getRating(), p.getCount());
            total += p.getCount();
            weightedSum += p.getRating() * p.getCount();
        }

        double average = total > 0 ? Math.round((weightedSum / total) * 10.0) / 10.0 : 0.0;
        return reviewMapper.toStatsResponse(average, total, distribution);
    }
}
