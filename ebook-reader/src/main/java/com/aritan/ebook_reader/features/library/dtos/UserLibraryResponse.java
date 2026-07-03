package com.aritan.ebook_reader.features.library.dtos;

import com.aritan.ebook_reader.common.enums.book.LibraryAccessStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLibraryResponse {
    private Long userLibraryId;
    private UserLibraryBookResponse book;
    private LibraryAccessStatus accessStatus;
    private Boolean isFavorite;
    private LocalDateTime acquiredAt;
    private UserLibraryReadingProgressResponse readingProgress;
}
