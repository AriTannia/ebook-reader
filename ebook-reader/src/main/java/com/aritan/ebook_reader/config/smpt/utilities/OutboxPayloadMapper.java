package com.aritan.ebook_reader.config.smpt.utilities;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class OutboxPayloadMapper {
    private final ObjectMapper objectMapper;

    public String serialize(Object payload) {
        return objectMapper.writeValueAsString(payload);
    }

    public <T> T deserialize(String json, Class<T> clazz) {
        return objectMapper.readValue(json, clazz);
    }
}
