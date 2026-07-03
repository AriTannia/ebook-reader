package com.aritan.ebook_reader.features.library.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLibraryBookResponse {
    private Long bookId;
    private String title;
    private String coverImageUrl;
    private BigDecimal price;
}
