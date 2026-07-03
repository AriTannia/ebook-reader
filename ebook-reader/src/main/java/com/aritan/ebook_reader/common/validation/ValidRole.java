package com.aritan.ebook_reader.common.validation;

import com.aritan.ebook_reader.common.constants.messages.user.UserMessage;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RoleValidator.class)
@Documented
public @interface ValidRole {
    String message() default UserMessage.INVALID_ROLE_FORMAT;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
