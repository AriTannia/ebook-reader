package com.aritan.ebook_reader.config.mvc.config.converter;

import com.aritan.ebook_reader.common.constants.messages.param.ParamConversionMessage;
import com.aritan.ebook_reader.config.mvc.config.utilities.ParamUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class StringToUuidConverter implements Converter<String, UUID> {

    @Override
    public UUID convert(String source) {
        if (ParamUtils.isBlankOrNullable(source)) {
            return null;
        }
        try {
            return UUID.fromString(source.trim());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(String.format(ParamConversionMessage.INVALID_UUID, source));
        }
    }
}