package com.aritan.ebook_reader.features.order.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long orderItemId;
    private Long bookId;
    private String bookTitleSnapshot;
    private BigDecimal priceSnapshot;
    private Integer quantity;
}
