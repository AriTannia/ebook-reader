package com.aritan.ebook_reader.features.book.bookformat;

import com.aritan.ebook_reader.common.models.book.BookFormat;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IBookFormatRepository extends JpaRepository<BookFormat, Long> {
    List<BookFormat> findAllByBook_BookId(Long bookId);
    @EntityGraph(attributePaths = {"book"})
    Optional<BookFormat> findByBook_BookIdAndIsPrimaryTrue(Long bookId);
    @NonNull
    Optional<BookFormat> findById(@NonNull Long bookFormatId);
    boolean existsByBook_BookIdAndIsPrimaryTrue(Long bookId);

    // Trong BookFormatRepository:
    @Modifying
    @Query("UPDATE BookFormat f SET f.isPrimary = false " +
            "WHERE f.book.bookId = :bookId AND f.isPrimary = true AND f.bookFormatId <> :excludeId")
    int unsetCurrentPrimary(@Param("bookId") Long bookId, @Param("excludeId") Long excludeId);

    @Modifying
    @Query("UPDATE BookFormat f SET f.isPrimary = :isPrimary WHERE f.bookFormatId = :formatId")
    int updatePrimaryFlag(@Param("formatId") Long formatId, @Param("isPrimary") boolean isPrimary);

}
