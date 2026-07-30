package com.aritan.ebook_reader.features.book.repositories;

import com.aritan.ebook_reader.common.enums.book.BookStatus;
import com.aritan.ebook_reader.common.models.book.Book;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class IBookRepositoryImpl implements IBookRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;
    @Override
    public Page<Book> findAllBooksForAdmin(Specification<Book> spec, Pageable pageable) {
        return executeQuery(spec, pageable);
    }

    private Page<Book> executeQuery(Specification<Book> spec, Pageable pageable){
// Get SQL builder
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // Query
        CriteriaQuery<Book> cq = cb.createQuery(Book.class);
        // Choose Table
        Root<Book> root = cq.from(Book.class);

        Predicate predicate =
                spec == null
                        ? cb.conjunction()
                        : spec.toPredicate(root, cq, cb);

        cq.where(predicate);
        cq.orderBy(buildOrders(root, cb, pageable.getSort()));

        // Change CriteriaQuery to real SQL
        TypedQuery<Book> query = entityManager.createQuery(cq);

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        // Run query
        List<Book> pagedBooks = query.getResultList();

        // Count
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Book> countRoot = countQuery.from(Book.class);

        Predicate countPredicate =
                spec == null
                        ? cb.conjunction()
                        : spec.toPredicate(countRoot, countQuery, cb);

        countQuery.select(cb.count(countRoot));
        countQuery.where(countPredicate);

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        // Fetch items
        List<Long> bookIds = pagedBooks.stream()
                .map(Book::getBookId)
                .toList();

        List<Book> withItems = entityManager.createQuery(
                        "SELECT DISTINCT b FROM Book b " +
                                "WHERE b.bookId IN :ids",
                        Book.class
                )
                .setParameter("ids", bookIds)
                .getResultList();

        Map<Long, Book> byId = withItems.stream()
                .collect(Collectors.toMap(Book::getBookId, b -> b));

        List<Book> content = bookIds.stream()
                .map(byId::get)
                .toList();

        return new PageImpl<>(content, pageable, total);
    }

    private List<Order> buildOrders(
            Root<Book> root,
            CriteriaBuilder cb,
            Sort sort
    ) {

        List<jakarta.persistence.criteria.Order> orders = new ArrayList<>();

        Expression<Integer> priority =
                cb.<Integer>selectCase()
                        .when(cb.equal(root.get("status"), BookStatus.ACTIVE), 0)
                        .otherwise(1);

        orders.add(cb.asc(priority));

        for (Sort.Order s : sort) {

            Path<?> path = root.get(s.getProperty());

            orders.add(
                    s.isAscending()
                            ? cb.asc(path)
                            : cb.desc(path)
            );
        }

        return orders;
    }
}
