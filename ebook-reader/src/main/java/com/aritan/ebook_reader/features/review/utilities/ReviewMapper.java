package com.aritan.ebook_reader.features.review.utilities;

import com.aritan.ebook_reader.common.models.book.Book;
import com.aritan.ebook_reader.common.models.book.Review;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.review.dtos.ReviewCreateRequest;
import com.aritan.ebook_reader.features.review.dtos.ReviewResponse;
import com.aritan.ebook_reader.features.review.dtos.ReviewUpdatedRequest;
import com.aritan.ebook_reader.features.user.utilities.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(
        componentModel = "spring",
        uses = UserMapper.class
)
public interface ReviewMapper {
    ReviewResponse toReviewResponse(Review review);

    @Mapping(target = "reviewId", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "verifiedPurchase", ignore = true)
    @Mapping(target = "edited", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Review toEntity(
            ReviewCreateRequest createRequest,
            Book book,
            User user);

    @Mapping(target = "book", source = "book")
    @Mapping(target = "reviewId", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "verifiedPurchase", ignore = true)
    @Mapping(target = "edited", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void toEntity(
            ReviewUpdatedRequest updatedRequest,
            Book book,
            User user,
            @MappingTarget Review review
    );
}
