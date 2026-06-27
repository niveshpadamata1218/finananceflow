package com.financeflow.validation;

import com.financeflow.entity.enums.RoleName;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class RoleValidator implements ConstraintValidator<ValidRole, String> {

    private Set<String> allowedRoles;

    @Override
    public void initialize(ValidRole constraintAnnotation) {
        allowedRoles = Arrays.stream(RoleName.values())
                .map(Enum::name)
                .collect(Collectors.toSet());
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        return allowedRoles.contains(value.toUpperCase());
    }
}