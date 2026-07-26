package com.aritan.ebook_reader.features.publisher.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublisherUpdatedRequest {
    @NotBlank(message = "Publisher name is required")
    private String publisherName;
    private String logoUrl;
}
