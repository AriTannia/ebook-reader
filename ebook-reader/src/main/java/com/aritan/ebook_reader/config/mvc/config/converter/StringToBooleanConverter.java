package com.aritan.ebook_reader.config.mvc.config.converter;

import com.aritan.ebook_reader.common.constants.messages.param.ParamConversionMessage;
import com.aritan.ebook_reader.common.constants.param.ParamValueConstants;
import com.aritan.ebook_reader.common.exception.IllegalStateException;
import com.aritan.ebook_reader.config.mvc.config.utilities.ParamUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Set;

@Component
public class StringToBooleanConverter implements Converter<String, Boolean> {
    @Override
    public Boolean convert(String source) {
        if (ParamUtils.isBlankOrNullable(source)) {
            return null;
        }
        if (ParamValueConstants.TRUE_VALUE.equalsIgnoreCase(source)) {
            return Boolean.TRUE;
        }
        if (ParamValueConstants.FALSE_VALUE.equalsIgnoreCase(source)) {
            return Boolean.FALSE;
        }
        throw new IllegalArgumentException(String.format(ParamConversionMessage.INVALID_BOOLEAN, source));
    }
}
