package com.aritan.ebook_reader.features.library.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaveProgressRequest {
    @NotNull(message = "bookId is required")
    private Long bookId;

    @NotBlank(message = "locator is required")
    @Size(max = 500)
    private String locator;

    @NotNull(message = "progressPercent is required")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private BigDecimal progressPercent;
}
