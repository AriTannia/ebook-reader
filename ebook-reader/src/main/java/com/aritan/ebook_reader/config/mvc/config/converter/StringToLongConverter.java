package com.aritan.ebook_reader.config.mvc.config.converter;

import com.aritan.ebook_reader.common.constants.messages.param.ParamConversionMessage;
import com.aritan.ebook_reader.config.mvc.config.utilities.ParamUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToLongConverter implements Converter<String, Long> {

    @Override
    public Long convert(String source) {
        if (ParamUtils.isBlankOrNullable(source)) {
            return null;
        }
        try {
            return Long.parseLong(source.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(String.format(ParamConversionMessage.INVALID_LONG, source));
        }
    }
}