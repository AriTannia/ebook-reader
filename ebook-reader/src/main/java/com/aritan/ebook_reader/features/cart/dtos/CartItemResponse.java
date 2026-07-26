package com.aritan.ebook_reader.features.cart.dtos;

import com.aritan.ebook_reader.features.book.dtos.BookSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    public Long cartItemId;
    public BookSummaryResponse book;
    public LocalDateTime addedAt;
}
