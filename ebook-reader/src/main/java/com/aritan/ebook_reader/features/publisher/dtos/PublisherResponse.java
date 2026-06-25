package com.aritan.ebook_reader.features.publisher.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublisherResponse {
    private Long publisherId;
    private String publisherName;
    private String logoUrl;
}
