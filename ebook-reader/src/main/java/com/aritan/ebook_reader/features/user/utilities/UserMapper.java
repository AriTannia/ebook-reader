package com.aritan.ebook_reader.features.user.utilities;

import com.aritan.ebook_reader.common.models.user.Role;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.features.review.dtos.ReviewUserResponse;
import com.aritan.ebook_reader.features.user.dtos.UserCreateRequest;
import com.aritan.ebook_reader.features.user.dtos.UserResponse;
import com.aritan.ebook_reader.features.user.dtos.UserUpdateProfileRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserResponse(User user);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void toEntity(
            UserCreateRequest createRequest,
            @MappingTarget User user);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void toEntity(
            UserUpdateProfileRequest profileUpdatedRequest,
            @MappingTarget User user);

    ReviewUserResponse toReviewUserResponse(User user);

    default List<String> map(Set<Role> roles) {
        if (roles == null) {
            return Collections.emptyList();
        }

        return roles.stream()
                .map(role -> role.getName().name())
                .toList();
    }
}
