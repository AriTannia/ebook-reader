package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.constants.UserMessages;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.features.user.dtos.UserCreateRequest;
import com.aritan.ebook_reader.features.user.dtos.UserResponse;
import com.aritan.ebook_reader.features.user.dtos.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException(UserMessages.NO_DATA_FOUND);
        }

        return users.stream().map(user -> new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getRoles().stream().map(role -> role.getName().name()).toList()
        )).toList();
    }

    @Override
    public User createUser(UserCreateRequest user) {
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPasswordHash(user.getPassword());
        newUser.setFullName(user.getUserName());

        userRepository.save(newUser);
        return newUser;
    }

    @Override
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessages.NO_DATA_FOUND));

        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getRoles().stream().map(role -> role.getName().name()).toList());
    }

    @Override
    public UserResponse updateUser(Long userId, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessages.NO_DATA_FOUND));

        if (userUpdateRequest.getFullName() != null && !userUpdateRequest.getFullName().isBlank()) {
            user.setFullName(userUpdateRequest.getFullName());
        }

        if (userUpdateRequest.getPassword() != null && !userUpdateRequest.getPassword().isBlank()) {
            String passwordHash = passwordEncoder.encode(userUpdateRequest.getPassword());
            user.setPasswordHash(passwordHash);
        }

        if (userUpdateRequest.getAvatarUrl() != null && !userUpdateRequest.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(userUpdateRequest.getAvatarUrl());
        }

        userRepository.save(user);

        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getRoles().stream().map(role -> role.getName().name()).toList());
    }
}
