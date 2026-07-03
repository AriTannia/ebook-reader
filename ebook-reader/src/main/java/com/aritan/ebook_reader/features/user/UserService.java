package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.constants.messages.user.UserMessage;
import com.aritan.ebook_reader.common.enums.ERole;
import com.aritan.ebook_reader.common.exception.ResourceNotFoundException;
import com.aritan.ebook_reader.common.models.user.Role;
import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.config.s3.utilities.StorageUrlExtension;
import com.aritan.ebook_reader.config.security.jwt.repositories.IRoleRepository;
import com.aritan.ebook_reader.features.file.IFileService;
import com.aritan.ebook_reader.features.user.dtos.*;
import com.aritan.ebook_reader.features.user.utilities.UserMapper;
import com.aritan.ebook_reader.features.user.utilities.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final IFileService fileService;
    private final StorageUrlExtension storageUrlExtension;

    @Override
    public Page<UserResponse> getAllUsers(UserFilterRequest request, Pageable pageable) {
        Specification<User> spec = Specification
                .where(UserSpecification.hasKeyword(request.getKeyword()));

        Page<User> users = userRepository.findAll(spec, pageable);

        return users.map(user -> {
            UserResponse response = userMapper.toUserResponse(user);
            response.setAvatarUrl(storageUrlExtension.getPublicUrl(user.getAvatarUrl()));

            return response;
        });
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

        UserResponse userResponse = userMapper.toUserResponse(user);
        userResponse.setAvatarUrl(storageUrlExtension.getPublicUrl(user.getAvatarUrl()));

        return userResponse;
    }

    @Override
    public UserResponse updateUserProfile(Long userId, UserUpdateProfileRequest profileUpdatedRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessage.NO_DATA_FOUND));

        userMapper.toEntity(profileUpdatedRequest, user);

        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessage.NO_DATA_FOUND));

        userRepository.delete(user);
    }

    @Override
    public UserResponse updateUserAvatar(
            Long userId,
            UserUpdateAvatarRequest updateAvatarRequest) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessage.NO_DATA_FOUND));

        String oldAvatarUrl = user.getAvatarUrl();

        user.setAvatarUrl(updateAvatarRequest.getAvatarUrl());
        userRepository.save(user);

        if(oldAvatarUrl != null && !oldAvatarUrl.equals(updateAvatarRequest.getAvatarUrl())) {
            fileService.deleteFile(oldAvatarUrl);
        }

        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateUserRole(Long userId, UserUpdateRoleRequest updateRoleRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserMessage.NO_DATA_FOUND));

        Set<Role> roles = updateRoleRequest.getRoles().stream()
                .map(roleName -> roleRepository.findByName(ERole.valueOf(roleName))
                        .orElseThrow(() -> new ResourceNotFoundException(UserMessage.ROLE_NOT_FOUND)))
                .collect(Collectors.toSet());

        user.setRoles(roles);
        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }
}
