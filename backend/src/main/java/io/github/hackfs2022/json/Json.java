package io.github.hackfs2022.json;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.UncheckedIOException;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_ABSENT;
import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;

public final class Json {

    public final static ObjectMapper OBJECT_MAPPER = new ObjectMapper()
        .setSerializationInclusion(NON_ABSENT)
        .configure(FAIL_ON_UNKNOWN_PROPERTIES, false)
        .findAndRegisterModules();

    public static <T> T parse(String jsonText, Class<T> type) {
        try {
            return OBJECT_MAPPER.readValue(jsonText, type);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static String toJsonString(Object element) {
        try {
            return OBJECT_MAPPER.writeValueAsString(element);
        } catch (JsonProcessingException e) {
            throw new UncheckedIOException(e);
        }
    }
}
