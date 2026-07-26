package com.aritan.ebook_reader.features.tag.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagUpdatedRequest {
    private UUID tagId;
    @NotBlank(message = "Tag name is required")
    private String tagName;
}
