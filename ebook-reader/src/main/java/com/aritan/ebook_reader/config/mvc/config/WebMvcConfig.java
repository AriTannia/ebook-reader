package com.aritan.ebook_reader.config.mvc.config;

import com.aritan.ebook_reader.config.mvc.config.converter.StringToBooleanConverter;
import com.aritan.ebook_reader.config.mvc.config.converter.StringToLongConverter;
import com.aritan.ebook_reader.config.mvc.config.converter.StringToUuidConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {
    private final StringToBooleanConverter stringToBooleanConverter;
    private final StringToLongConverter stringToLongConverter;
    private final StringToUuidConverter stringToUuidConverter;

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(stringToBooleanConverter);
        registry.addConverter(stringToLongConverter);
        registry.addConverter(stringToUuidConverter);
    }
}
