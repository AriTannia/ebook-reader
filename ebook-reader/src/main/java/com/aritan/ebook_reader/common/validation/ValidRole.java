package com.aritan.ebook_reader.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RoleValidator.class)
@Documented
public @interface ValidRole {
    String message() default "Định dạng quyền (Role) không hợp lệ hoặc không tồn tại!";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
