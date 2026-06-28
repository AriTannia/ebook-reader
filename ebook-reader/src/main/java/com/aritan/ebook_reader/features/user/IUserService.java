package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.features.user.dtos.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {

    Page<UserResponse> getAllUsers(UserFilterRequest request, Pageable pageable);
    UserResponse createUser(UserCreateRequest user);
    UserResponse getUserById(Long userId);
    UserResponse updateUserProfile(Long userId, UserUpdateProfileRequest profileUpdatedRequest);
    void deleteUser(Long userId);

    UserResponse updateUserAvatar(Long userId, @Valid UserUpdateAvatarRequest updateAvatarRequest);
}
