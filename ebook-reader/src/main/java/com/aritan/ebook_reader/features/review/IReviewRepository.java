package com.aritan.ebook_reader.features.review;

import com.aritan.ebook_reader.common.models.BookFormat;
import com.aritan.ebook_reader.common.models.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IReviewRepository extends JpaRepository<Review, UUID> {
    Page<Review> findAllByBook_BookId(Long bookId, Pageable pageable);
    Page<Review> findAllByUser_UserId(Long userId, Pageable pageable);
}
