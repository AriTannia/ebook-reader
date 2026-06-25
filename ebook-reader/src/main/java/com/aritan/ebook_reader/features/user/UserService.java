package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.constants.messages.UserMessage;
import com.aritan.ebook_reader.common.enums.ERole;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.Role;
import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.config.security.jwt.repositories.IRoleRepository;
import com.aritan.ebook_reader.features.user.dtos.UserCreateRequest;
import com.aritan.ebook_reader.features.user.dtos.UserResponse;
import com.aritan.ebook_reader.features.user.dtos.UserUpdateRequest;
import com.aritan.ebook_reader.features.user.utilities.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException(UserMessage.NO_DATA_FOUND);
        }

        return users.stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Override
    public UserResponse createUser(UserCreateRequest user) {
        User newUser = new User();

        userMapper.toEntity(user, newUser);

        Set<Role> roles = user.getRoles().stream()
                        .map(roleName -> roleRepository.findByName(ERole.valueOf(roleName))
                        .orElseThrow(() -> new ResourceNotFoundException(UserMessage.ROLE_NOT_FOUND)))
                        .collect(Collectors.toSet());

        newUser.setRoles(roles);
        newUser.setPasswordHash(passwordEncoder.encode(user.getPassword()));

        userRepository.save(newUser);
        return userMapper.toUserResponse(newUser);
    }

    @Override
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessage.NO_DATA_FOUND));

        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateUser(Long userId, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessage.NO_DATA_FOUND));

        userMapper.toEntity(userUpdateRequest, user);

        Set<Role> roles = userUpdateRequest.getRoles().stream()
                .map(roleName -> roleRepository.findByName(ERole.valueOf(roleName))
                        .orElseThrow(() -> new ResourceNotFoundException(UserMessage.ROLE_NOT_FOUND)))
                .collect(Collectors.toSet());

        user.setRoles(roles);
        user.setPasswordHash(passwordEncoder.encode(userUpdateRequest.getPassword()));

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessage.NO_DATA_FOUND));

        userRepository.delete(user);
    }
}
