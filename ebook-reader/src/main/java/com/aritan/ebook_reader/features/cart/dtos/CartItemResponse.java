package com.aritan.ebook_reader.features.cart.dtos;

import com.aritan.ebook_reader.features.book.dtos.BookSumaryResponse;
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
    public BookSumaryResponse book;
    public LocalDateTime addedAt;
}
