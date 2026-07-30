package com.aritan.ebook_reader.features.library.readinghistory;

import com.aritan.ebook_reader.common.models.book.ReadingProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @Modifying
    @Transactional
    @Query(value = """
    INSERT INTO reading_progresses (user_id, book_id, locator, progress_percent, last_read_at, status, created_at)
    VALUES (:userId, :bookId, :locator, :progressPercent, :lastReadAt, 'IN_PROGRESS', now())
    ON CONFLICT (user_id, book_id) DO UPDATE SET
        locator = EXCLUDED.locator,
        progress_percent = EXCLUDED.progress_percent,
        last_read_at = EXCLUDED.last_read_at,
        status = CASE
            WHEN reading_progresses.status = 'NOT_STARTED' THEN 'IN_PROGRESS'
            ELSE reading_progresses.status
        END
    """, nativeQuery = true)
    void upsertProgress(
            @Param("userId") Long userId,
            @Param("bookId") Long bookId,
            @Param("locator") String locator,
            @Param("progressPercent") BigDecimal progressPercent,
            @Param("lastReadAt") LocalDateTime lastReadAt
    );
}
