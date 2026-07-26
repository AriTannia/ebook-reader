package com.aritan.ebook_reader.config.mvc.config.utilities;

import com.aritan.ebook_reader.common.constants.param.ParamValueConstants;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;
@NoArgsConstructor
public class ParamUtils {
    public static boolean isBlankOrNullable(String value) {
        return !StringUtils.hasText(value)
                || ParamValueConstants.NULLABLE_VALUES.stream().anyMatch(v -> v.equalsIgnoreCase(value));
    }
}
