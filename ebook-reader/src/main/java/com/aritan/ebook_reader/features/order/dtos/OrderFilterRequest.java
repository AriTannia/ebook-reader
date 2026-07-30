package com.aritan.ebook_reader.features.order.dtos;

import com.aritan.ebook_reader.common.enums.order.OrderStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class OrderFilterRequest {
    private Set<OrderStatus> statuses;
    private LocalDate createdFrom;
    private LocalDate createdTo;
}
