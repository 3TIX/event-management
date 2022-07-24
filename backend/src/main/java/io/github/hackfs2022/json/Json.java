package io.github.hackfs2022.json;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.List;

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

    public static <T> T parse(JsonNode json, Class<T> type) {
        try {
            return OBJECT_MAPPER.treeToValue(json, type);
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

    public static <T> List<T> parseList(JsonNode json, Class<T> type) {
        try {
            return OBJECT_MAPPER.treeToValue(json, OBJECT_MAPPER.getTypeFactory()
                .constructCollectionType(ArrayList.class, type));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static JsonNode parseTree(String jsonText) {
        try {
            return OBJECT_MAPPER.readTree(jsonText);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static ObjectNode object() {
        return new ObjectNode(OBJECT_MAPPER.getNodeFactory());
    }
}
