package com.aritan.ebook_reader.features.user.dtos;

import com.aritan.ebook_reader.common.constants.messages.UserMessage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateProfileRequest {
    @NotBlank(message = UserMessage.FULL_NAME_EMPTY)
    private String fullName;
    @NotBlank(message = UserMessage.EMAIL_EMPTY)
    @Email(message = UserMessage.EMAIL_INVALID)
    private String email;
}
