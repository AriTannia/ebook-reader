package com.aritan.ebook_reader.features.library.dtos;

import com.aritan.ebook_reader.common.enums.book.ReadingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLibraryReadingProgressResponse {
    private BigDecimal progressPercent;
    private ReadingStatus status;
}
