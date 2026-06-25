package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.constants.messages.UserMessage;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.common.models.User;
import com.aritan.ebook_reader.features.user.dtos.UserCreateRequest;
import com.aritan.ebook_reader.features.user.dtos.UserResponse;
import com.aritan.ebook_reader.features.user.dtos.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final IUserService userService;

    @GetMapping
    public ResponseEntity<EBResponse<List<UserResponse>>> getAllUsers() {
        var result = userService.getAllUsers();
        return ResponseEntity.ok(EBResponse.Success(result, UserMessage.DATA_SUCCESS));
    }

    @GetMapping("{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<UserResponse>> getUserById(@PathVariable Long userId){
        var result = userService.getUserById(userId);
        return ResponseEntity.ok(EBResponse.Success(result, UserMessage.DATA_SUCCESS));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<UserResponse>> createUser(@RequestBody UserCreateRequest user){
        var result = userService.createUser(user);
        return ResponseEntity.ok(EBResponse.Created(result, UserMessage.DATA_CREATED_SUCCESSFULLY));
    }

    @PutMapping("{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EBResponse<UserResponse>> updateUser(@PathVariable Long userId, @RequestBody UserUpdateRequest userUpdateRequest){
        var result = userService.updateUser(userId, userUpdateRequest);
        return ResponseEntity.ok(EBResponse.Success(result, UserMessage.DATA_UPDATED_SUCCESSFULLY));
    }

    @DeleteMapping("{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EBResponse<?>> deleteUser(@PathVariable Long userId){
        userService.deleteUser(userId);
        return ResponseEntity.ok(EBResponse.Success(null, UserMessage.DATA_DELETED_SUCCESSFULLY));
    }
}
