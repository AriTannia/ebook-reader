package com.aritan.ebook_reader.features.book.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BookFormatUpdateRequest {
    private String storageUrl;
    private Boolean isPrimary;
}
