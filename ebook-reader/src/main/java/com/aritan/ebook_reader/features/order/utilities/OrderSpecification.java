package com.aritan.ebook_reader.features.order.utilities;

import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import com.aritan.ebook_reader.common.models.order.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Component
public class OrderSpecification {
    public static Specification<Order> hasStatuses(Set<OrderStatus> statuses) {
        return (root, query, cb) -> {
            if (statuses == null || statuses.isEmpty()) {
                return cb.conjunction();
            }

            return root.get("status").in(statuses);
        };
    }

    public static Specification<Order> createdFrom(LocalDate createFrom) {
        return (root, query, cb) -> {
            if (createFrom == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("createdAt"), createFrom.atStartOfDay());
        };
    }

    public static Specification<Order> createdTo(LocalDate createTo) {
        return (root, query, cb) -> {
            if (createTo == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("createdAt"), createTo.atTime(LocalTime.MAX));
        };
    }
}
