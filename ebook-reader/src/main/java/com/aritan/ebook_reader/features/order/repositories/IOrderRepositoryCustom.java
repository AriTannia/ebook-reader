package com.aritan.ebook_reader.features.order.repositories;

import com.aritan.ebook_reader.common.models.order.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface IOrderRepositoryCustom {
    Page<Order> findAllByUser_UserId(Long userId, Specification<Order> spec, Pageable pageable);
    Page<Order> findAll(Specification<Order> spec, Pageable pageable);
}
