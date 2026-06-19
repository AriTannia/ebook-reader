package com.aritan.ebook_reader.common.validation;

import com.aritan.ebook_reader.common.enums.ERole;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.HashSet;
import java.util.Set;

public class RoleValidator implements ConstraintValidator<ValidRole, Set<String>> {
    @Override
    public boolean isValid(Set<String> roles, ConstraintValidatorContext context) {
        // Allow empty or null roles, as they will default to USER
        if (roles == null || roles.isEmpty()) {
            return true;
        }

        Set<String> normalizedRoles = new HashSet<>();

        for (String role : roles) {
            if (ERole.getOrDefault(role) == null) {
                return false; // Invalid role found
            }

            try{
                String cleanRole = role.trim().toUpperCase();

                if (!cleanRole.startsWith("ROLE_")) {
                    cleanRole = "ROLE_" + cleanRole;
                }

                ERole.valueOf(cleanRole);
                normalizedRoles.add(cleanRole);
            } catch (IllegalArgumentException e) {
                return false; // Invalid role found
            }
        }
        roles.clear();
        roles.addAll(normalizedRoles);

        return true; // All roles are valid
    }
}
