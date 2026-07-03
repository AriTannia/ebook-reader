package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.constants.messages.user.UserMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.user.dtos.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final IUserService userService;

    // Public
    @PatchMapping("{userId}/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<UserResponse>> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserUpdateProfileRequest profileUpdatedRequest){
        var result = userService.updateUserProfile(userId, profileUpdatedRequest);
        return ResponseEntity.ok(EBResponse.Success(result, UserMessage.DATA_UPDATED_SUCCESSFULLY));
    }

    @PatchMapping("{userId}/avatar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<UserResponse>> updateUserAvatar(
            @PathVariable Long userId,
            @RequestBody UserUpdateAvatarRequest updateAvatarRequest){
        var result = userService.updateUserAvatar(userId, updateAvatarRequest);
        return ResponseEntity.ok(EBResponse.Success(result, UserMessage.DATA_UPDATED_SUCCESSFULLY));
    }

    // Admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<Page<UserResponse>>> getAllUsers(UserFilterRequest request, Pageable pageable) {
        var result = userService.getAllUsers(request, pageable);
        return ResponseEntity.ok(EBResponse.Success(result, UserMessage.DATA_SUCCESS));
    }

    @GetMapping("{userId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<UserResponse>> getUserById(@PathVariable Long userId){
        var result = userService.getUserById(userId);
        return ResponseEntity.ok(EBResponse.Success(result, UserMessage.DATA_SUCCESS));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<UserResponse>> createUser(@RequestBody UserCreateRequest user){
        var result = userService.createUser(user);
        return ResponseEntity.ok(EBResponse.Created(result, UserMessage.DATA_CREATED_SUCCESSFULLY));
    }

    @DeleteMapping("{userId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deleteUser(@PathVariable Long userId){
        userService.deleteUser(userId);
        return ResponseEntity.ok(EBResponse.Success(null, UserMessage.DATA_DELETED_SUCCESSFULLY));
    }

    @PatchMapping("/{userId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<UserResponse>> updateUserRole(
            @PathVariable Long userId, @RequestBody UserUpdateRoleRequest updateRoleRequest){
        var result = userService.updateUserRole(userId, updateRoleRequest);
        return ResponseEntity.ok(EBResponse.Success(result, UserMessage.DATA_UPDATED_SUCCESSFULLY));
    }
}
