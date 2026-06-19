package com.aritan.ebook_reader.features.auth.dtos;

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
    @NotBlank(message = "Full name cannot be empty!")
    @Size(min = 2, max = 50, message = "Full name must be between 2 and 50 characters long!")
    private String fullName;

    @NotBlank(message = "Email address cannot be empty!")
    @Email(message = "Invalid email format!")
    private String email;

    @NotBlank(message = "Password cannot be empty!")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters long!")
    private String password;

    @ValidRole
    private Set<String> role;
}
