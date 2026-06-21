package com.aritan.ebook_reader.features.auth.dtos;

import com.aritan.ebook_reader.common.constants.UserMessages;
import com.aritan.ebook_reader.common.validation.ValidRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
    @NotBlank(message = UserMessages.FULL_NAME_EMPTY)
    @Size(min = 2, max = 50, message = UserMessages.FULL_NAME_SIZE)
    private String fullName;

    @NotBlank(message = UserMessages.EMAIL_EMPTY)
    @Email(message = UserMessages.EMAIL_INVALID)
    private String email;

    @NotBlank(message = UserMessages.PASSWORD_EMPTY)
    @Size(min = 6, max = 40, message = UserMessages.PASSWORD_SIZE)
    private String password;

    @ValidRole
    private Set<String> role;
}
