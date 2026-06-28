package com.aritan.ebook_reader.features.auth.dtos;

import com.aritan.ebook_reader.features.user.dtos.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthenticationResponse {
    private UserJwtHeaderResponse userJwtHeaderResponse;
    private UserResponse userResponse;
}
