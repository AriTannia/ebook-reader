package com.aritan.ebook_reader.features.publisher.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublisherCreateRequest {
    @NotBlank(message = "Publisher name is required")
    private String publisherName;
    private String logoUrl;
}
