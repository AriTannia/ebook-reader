package com.aritan.ebook_reader.common.enums;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public enum ERole {
    ROLE_ADMIN,
    ROLE_USER;

    private static final Map<String, ERole> roleMap = Arrays.stream(ERole.values())
            .collect(Collectors.toMap(Enum::name, role -> role));

    public static ERole getOrDefault(String name){
        if(name == null) return ROLE_USER;
        return roleMap.getOrDefault(name.toUpperCase(), ROLE_USER);
    }
}
