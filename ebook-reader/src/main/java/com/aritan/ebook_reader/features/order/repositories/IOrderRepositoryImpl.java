package com.aritan.ebook_reader.features.order.repositories;

import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.models.order.Order;
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
public class IOrderRepositoryImpl implements IOrderRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Order> findAll(
            Specification<Order> spec,
            Pageable pageable
    ) {
        return executeQuery(
                null,
                spec,
                pageable
        );
    }

    @Override
    public Page<Order> findAllByUser_UserId(
            Long userId,
            Specification<Order> spec,
            Pageable pageable
    ) {
        return executeQuery(
                userId,
                spec,
                pageable
        );
    }

    private Page<Order> executeQuery(Long userId, Specification<Order> spec, Pageable pageable) {
        // Get SQL builder
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // Query
        CriteriaQuery<Order> cq = cb.createQuery(Order.class);
        // Choose Table
        Root<Order> root = cq.from(Order.class);

        // Where condition
        Predicate predicate = buildPredicate(
                userId,
                spec,
                root,
                cq,
                cb
        );
        cq.where(predicate);

        cq.orderBy(buildOrders(root, cb, pageable.getSort()));

        // Change CriteriaQuery to real SQL
        TypedQuery<Order> query = entityManager.createQuery(cq);

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        // Run query
        List<Order> pagedOrders = query.getResultList();

        // Count
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Order> countRoot = countQuery.from(Order.class);

        Predicate countPredicate =
                buildPredicate(userId, spec, countRoot, countQuery, cb);

        countQuery.select(cb.count(countRoot));
        countQuery.where(countPredicate);

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        // Fetch items
        List<Long> orderIds = pagedOrders.stream()
                .map(Order::getOrderId)
                .toList();

        List<Order> withItems = entityManager.createQuery(
                "SELECT DISTINCT o FROM Order o " +
                            "LEFT JOIN FETCH o.items " +
                            "WHERE o.orderId IN :ids",
                Order.class
        )
                .setParameter("ids", orderIds)
                .getResultList();

        Map<Long, Order> byId = withItems.stream()
                .collect(Collectors.toMap(Order::getOrderId, o -> o));

        List<Order> content = orderIds.stream()
                .map(byId::get)
                .toList();

        return new PageImpl<>(content, pageable, total);
    }

    private Predicate buildPredicate(
            Long userId,
            Specification<Order> spec,
            Root<Order> root,
            CriteriaQuery<?> query,
            CriteriaBuilder cb
    ) {

        Predicate predicate =
                spec == null
                        ? cb.conjunction()
                        : spec.toPredicate(root, query, cb);

        if (userId != null) {

            predicate = cb.and(
                    cb.equal(
                            root.get("user").get("userId"),
                            userId
                    ),
                    predicate
            );
        }

        return predicate;
    }

    private List<jakarta.persistence.criteria.Order> buildOrders(
            Root<Order> root,
            CriteriaBuilder cb,
            Sort sort
    ) {

        List<jakarta.persistence.criteria.Order> orders = new ArrayList<>();

        Expression<Integer> priority =
                cb.<Integer>selectCase()
                        .when(cb.equal(root.get("status"), OrderStatus.PENDING), 0)
                        .when(cb.equal(root.get("status"), OrderStatus.PAID), 1)
                        .when(cb.equal(root.get("status"), OrderStatus.CANCELLED), 2)
                        .otherwise(3);

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
