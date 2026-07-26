package com.aritan.ebook_reader.config.smpt.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetPayload {
    private String resetToken;
    private String resetLink;
}
