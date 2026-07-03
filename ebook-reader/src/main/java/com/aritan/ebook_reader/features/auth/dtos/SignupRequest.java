package com.aritan.ebook_reader.features.auth.dtos;

import com.aritan.ebook_reader.common.constants.messages.user.UserMessage;
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
    @NotBlank(message = UserMessage.FULL_NAME_EMPTY)
    @Size(min = 2, max = 50, message = UserMessage.FULL_NAME_SIZE)
    private String fullName;

    @NotBlank(message = UserMessage.EMAIL_EMPTY)
    @Email(message = UserMessage.EMAIL_INVALID)
    private String email;

    @NotBlank(message = UserMessage.PASSWORD_EMPTY)
    @Size(min = 6, max = 40, message = UserMessage.PASSWORD_SIZE)
    private String password;

    @ValidRole
    private Set<String> role;
}
