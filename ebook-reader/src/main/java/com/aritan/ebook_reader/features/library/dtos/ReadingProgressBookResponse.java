package com.aritan.ebook_reader.features.library.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReadingProgressBookResponse {
    private Long bookId;
    private String title;
    private String coverImageUrl;
}
