package com.aritan.ebook_reader.features.library.readinghistory;

import com.aritan.ebook_reader.common.models.book.ReadingProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
    @EntityGraph(attributePaths = {"book"})
    Optional<ReadingProgress> findByUser_UserIdAndBook_BookId(Long userId, Long bookId);
    @EntityGraph(attributePaths = {"book"})
    Page<ReadingProgress> findByUser_UserIdOrderByLastReadAtDesc(
            Long userId,
            Pageable pageable
    );
    List<ReadingProgress> findByUser_UserIdAndBook_BookIdIn(Long userId, List<Long> bookIds);
    void deleteByBook_BookId(Long bookId);
}
