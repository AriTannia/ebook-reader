package com.aritan.ebook_reader.features.publisher.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublisherUpdatedRequest {
    private String publisherName;
    private String logoUrl;
}
