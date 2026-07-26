package com.aritan.ebook_reader.features.book.dtos;

import jakarta.validation.constraints.*;
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
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Description is required")
    private String description;
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    private String coverImageUrl;
    @NotBlank(message = "Language is required")
    private String language;
    @NotNull(message = "Published date is required")
    @PastOrPresent(message = "Published date cannot be in the future")
    private LocalDate publishedDate;
    @NotEmpty(message = "At least one author is required")
    private List<@NotNull Long> authorIds;
    @NotEmpty(message = "At least one category is required")
    private List<@NotNull Long> categoryIds;
    @NotEmpty(message = "At least one tag is required")
    private List<@NotNull UUID> tagIds;
    @NotNull(message = "Publisher is required")
    private Long publisherId;
}
