package com.aritan.ebook_reader.features.review;

import com.aritan.ebook_reader.common.models.book.Review;
import com.aritan.ebook_reader.features.review.dtos.RatingCountProjection;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IReviewRepository extends JpaRepository<Review, UUID> {
    @EntityGraph(attributePaths = {
            "user",
            "book"
    })
    Page<Review> findAllByBook_BookId(Long bookId, Pageable pageable);
    Page<Review> findAllByUser_UserId(Long userId, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {
            "user",
            "book"
    })
    @NonNull
    Optional<Review> findById(@NonNull UUID reviewId);

    @EntityGraph(attributePaths = {
            "user",
            "book"
    })
    @NonNull
    Optional<Review> findByReviewIdAndBook_BookId(@NonNull UUID reviewID, @NonNull Long bookId);

    @Query("""
        SELECT r.rating AS rating, COUNT(r) AS count
        FROM Review r
        WHERE r.book.bookId = :bookId
        GROUP BY r.rating
        """)
    List<RatingCountProjection> countRatingsByBookId(@Param("bookId") Long bookId);
    boolean existsByUser_UserIdAndBook_BookId(Long userId, Long bookId);
}
