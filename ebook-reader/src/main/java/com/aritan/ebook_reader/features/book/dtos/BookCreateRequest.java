package com.aritan.ebook_reader.features.book.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class BookCreateRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private String coverImageUrl;
    private String language;
    private LocalDate publishedDate;
    private List<Long> authorIds;
    private List<Long> categoryIds;
    private List<UUID> tagIds;
    private Long publisherId;
}
