package com.aritan.ebook_reader.features.auth.dtos;

import com.aritan.ebook_reader.common.constants.messages.user.UserMessage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResetPasswordRequest {
    @NotBlank private String token;
    @NotBlank(message = UserMessage.PASSWORD_EMPTY)
    @Size(min = 6, max = 40, message = UserMessage.PASSWORD_SIZE)
    private String newPassword;
}
