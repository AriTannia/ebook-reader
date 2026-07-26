package com.aritan.ebook_reader.features.library;

import com.aritan.ebook_reader.common.enums.book.LibraryAccessStatus;
import com.aritan.ebook_reader.common.models.book.UserLibrary;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserLibraryRepository extends
        JpaRepository<UserLibrary, Long>, JpaSpecificationExecutor<UserLibrary> {
    @EntityGraph(attributePaths = {"book"})
    @NonNull
    Page<UserLibrary> findAll(
            @NonNull Specification<UserLibrary> spec,
            @NonNull Pageable pageable);

    Optional<UserLibrary> findByUser_UserIdAndBook_BookId(Long userId, Long bookId);

    boolean existsByUser_UserIdAndBook_BookIdAndAccessStatus(
            Long userId, Long bookId, LibraryAccessStatus accessStatus);

    boolean existsByUser_UserIdAndOrderItem_OrderItemId(Long userId, Long orderItemId);
    boolean existsByUser_UserIdAndBook_BookId(
            Long userId,
            Long bookId
    );
}
