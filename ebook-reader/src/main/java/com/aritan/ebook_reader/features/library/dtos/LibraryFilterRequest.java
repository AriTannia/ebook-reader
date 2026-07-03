package com.aritan.ebook_reader.features.library.dtos;

import com.aritan.ebook_reader.common.enums.book.LibraryAccessStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LibraryFilterRequest {
    private String keyword;
    private LibraryAccessStatus accessStatus;
    private Boolean isFavorite;
    private Long categoryId;
    private Long authorId;
}
