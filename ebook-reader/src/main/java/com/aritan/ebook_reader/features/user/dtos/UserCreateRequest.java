package com.aritan.ebook_reader.features.user.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class UserCreateRequest {
    private String email;
    private String password;
    private String fullName;
    private Set<String> roles;
}
