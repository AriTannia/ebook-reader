package com.aritan.ebook_reader.features.library.dtos;

import com.aritan.ebook_reader.common.enums.book.ReadingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReadingProgressResponse {
    private Long readingProgressId;
    private ReadingProgressBookResponse book;
    private String locator;
    private BigDecimal progressPercent;
    private ReadingStatus status;
    private LocalDateTime lastReadAt;
    private LocalDateTime finishedAt;
}
