package io.github.hackfs2022.repository;

import org.jooq.impl.AbstractConverter;

import java.time.Instant;
import java.time.LocalDateTime;

import static java.time.ZoneOffset.UTC;

public class JooqTimestampConverter extends AbstractConverter<LocalDateTime, Instant> {

    public JooqTimestampConverter() {
        super(LocalDateTime.class, Instant.class);
    }

    @Override
    public Instant from(LocalDateTime databaseObject) {
        if (databaseObject == null) {
            return null;
        }

        return databaseObject.toInstant(UTC);
    }

    @Override
    public LocalDateTime to(Instant userObject) {
        if (userObject == null) {
            return null;
        }
        return LocalDateTime.ofInstant(userObject, UTC);
    }
}
