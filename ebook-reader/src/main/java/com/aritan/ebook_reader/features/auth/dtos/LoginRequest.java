package com.aritan.ebook_reader.features.auth.dtos;

import com.aritan.ebook_reader.common.constants.UserMessages;
import com.aritan.ebook_reader.common.models.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = UserMessages.EMAIL_EMPTY)
    @Email(message = UserMessages.EMAIL_INVALID)
    private String email;

    @NotBlank(message = UserMessages.PASSWORD_EMPTY)
    @Size(min = 6, max = 40, message = UserMessages.PASSWORD_SIZE)
    private String password;
}
