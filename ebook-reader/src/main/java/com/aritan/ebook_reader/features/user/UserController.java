package com.aritan.ebook_reader.features.user;

import com.aritan.ebook_reader.common.constants.UserMessages;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.user.dtos.UserRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {
    private IUserService userService;

    @GetMapping("/public/users")
    public ResponseEntity<EBResponse<List<User>>> getAllUsers() {
        var result = userService.getAllUsers();
        return ResponseEntity.ok(EBResponse.Success(result, UserMessages.SUCCESS));
    }

    @GetMapping("/public/users/{userId}")
    public ResponseEntity<EBResponse<User>> getUserById(@PathVariable Long userId){
        var result = userService.getUserById(userId);
        return ResponseEntity.ok(EBResponse.Success(result, UserMessages.SUCCESS));
    }

    @PostMapping("/public/users")
    public ResponseEntity<EBResponse<User>> createUser(@RequestBody UserRequest user){
        var result = userService.createUser(user);
        return ResponseEntity.ok(EBResponse.Created(result, UserMessages.CREATED));
    }
}
