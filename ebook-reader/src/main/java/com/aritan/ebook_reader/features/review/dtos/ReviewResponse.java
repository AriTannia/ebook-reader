package com.aritan.ebook_reader.features.review.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private UUID reviewId;
    private Integer rating;
    private ReviewUserResponse user;
    private String comment;
    private Integer helpfulCount;
    private Boolean verifiedPurchase;
    private Boolean edited;
    private LocalDateTime createdAt;
}
