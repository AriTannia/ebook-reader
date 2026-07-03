package com.aritan.ebook_reader.features.review;

import com.aritan.ebook_reader.common.constants.messages.book.BookMessage;
import com.aritan.ebook_reader.common.constants.messages.book.ReviewMessage;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.Review;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.config.s3.utilities.StorageUrlExtension;
import com.aritan.ebook_reader.features.auth.IAuthService;
import com.aritan.ebook_reader.features.book.IBookRepository;
import com.aritan.ebook_reader.features.review.dtos.ReviewCreateRequest;
import com.aritan.ebook_reader.features.review.dtos.ReviewResponse;
import com.aritan.ebook_reader.features.review.dtos.ReviewUpdatedRequest;
import com.aritan.ebook_reader.features.review.utilities.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final IAuthService authService;
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
    public ReviewResponse createReview(Long bookId, ReviewCreateRequest request) {
        Book existedBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(BookMessage.BOOK_NOT_FOUND));

        User currentUser = authService.getCurrentUser();
        Review review = reviewMapper.toEntity(request, existedBook, currentUser);
        reviewRepository.save(review);

        review.getUser().setAvatarUrl(storageUrlExtension.getPublicUrl(review.getUser().getAvatarUrl()));
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    public ReviewResponse updateReview(Long bookId, ReviewUpdatedRequest updateRequest, UUID reviewId) {
        Book existedBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(BookMessage.BOOK_NOT_FOUND));

        User currentUser =  authService.getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(ReviewMessage.REVIEW_NOT_FOUND));

        if(!review.getBook().getBookId().equals(bookId)){
            throw new ResourceNotFoundException(ReviewMessage.REVIEW_NOT_FOUND);
        }

        reviewMapper.toEntity(updateRequest, existedBook, currentUser, review);
        reviewRepository.save(review);

        review.getUser().setAvatarUrl(storageUrlExtension.getPublicUrl(review.getUser().getAvatarUrl()));
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    public void deleteReview(Long bookId, UUID reviewId) {
        bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(BookMessage.BOOK_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(ReviewMessage.REVIEW_NOT_FOUND));

        reviewRepository.delete(review);
    }

    @Override
    public ReviewResponse updateReviewHelpful(Long bookId, UUID reviewId) {
        bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException(BookMessage.BOOK_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(ReviewMessage.REVIEW_NOT_FOUND));

        if(!review.getBook().getBookId().equals(bookId)){
            throw new ResourceNotFoundException(ReviewMessage.REVIEW_NOT_FOUND);
        }

        review.setHelpfulCount(review.getHelpfulCount() + 1);
        reviewRepository.save(review);

        review.getUser().setAvatarUrl(storageUrlExtension.getPublicUrl(review.getUser().getAvatarUrl()));
        return reviewMapper.toReviewResponse(review);
    }
}
