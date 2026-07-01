package com.aritan.ebook_reader.features.review;

import com.aritan.ebook_reader.common.models.book.Review;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
