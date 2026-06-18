package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.features.user.dtos.UserRequest;

import java.util.List;

public interface IUserService {

    List<User> getAllUsers();
    User createUser(UserRequest user);
    User getUserById(Long userId);
}
