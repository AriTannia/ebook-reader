package com.aritan.ebook_reader.features.review.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewUserResponse {
    private Long userId;
    private String fullName;
    private String avatarUrl;
}
