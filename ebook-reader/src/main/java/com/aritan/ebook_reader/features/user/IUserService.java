package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.features.user.dtos.UserCreateRequest;
import com.aritan.ebook_reader.features.user.dtos.UserResponse;
import com.aritan.ebook_reader.features.user.dtos.UserUpdateRequest;

import java.util.List;

public interface IUserService {

    List<UserResponse> getAllUsers();
    User createUser(UserCreateRequest user);
    UserResponse getUserById(Long userId);
    UserResponse updateUser(Long userId, UserUpdateRequest userUpdateRequest);
}
