package io.github.hackfs2022.repository;

import io.github.hackfs2022.db.schema.tables.records.EventsRecord;
import io.github.hackfs2022.model.Event;
import io.github.hackfs2022.model.Event.State;
import org.jooq.ConnectionProvider;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.jooq.impl.DefaultConfiguration;

import java.util.Optional;

import static io.github.hackfs2022.db.schema.tables.Events.EVENTS;
import static io.github.hackfs2022.model.Event.Builder.event;
import static java.util.Optional.empty;
import static org.jooq.impl.DSL.max;

public class EventRepository {

    private final DSLContext db;

    public EventRepository(ConnectionProvider connectionProvider) {
        this.db = DSL.using(new DefaultConfiguration()
            .set(connectionProvider)
            .set(SQLDialect.POSTGRES));
    }

    public Event save(Event event) {
        final var result = db.insertInto(EVENTS)
            .set(toRecord(event))
            .returning()
            .fetchOne();

        return fromRecord(result);
    }

    public Event getByAddress(String address) {
        final var result = db.selectFrom(EVENTS)
            .where(EVENTS.ADDRESS.equal(address))
            .fetchOne();
        if (result == null) {
            throw new IllegalArgumentException(String.format("Event with address=%s is not found", address));
        }

        return fromRecord(result);
    }

    public Optional<Integer> getLastProcessedBlock() {
        final var maxBlockNumber = max(EVENTS.BLOCK_NUMBER);
        final var result = db.select(maxBlockNumber)
            .from(EVENTS)
            .fetchOne(maxBlockNumber);

        if (result == null) {
            return empty();
        }
        return Optional.of(result);
    }

    private EventsRecord toRecord(Event event) {
        return new EventsRecord(
            event.id,
            event.createdDate,
            event.updatedDate,
            event.state.name(),
            event.blockNumber,
            event.address,
            event.name,
            event.endDate,
            event.distributePoaps);
    }

    private Event fromRecord(EventsRecord record) {
        return event()
            .id(record.getId())
            .createdDate(record.getCreatedDate())
            .updatedDate(record.getUpdatedDate())
            .state(State.valueOf(record.getState()))
            .blockNumber(record.getBlockNumber())
            .address(record.getAddress())
            .name(record.getName())
            .endDate(record.getEndDate())
            .distributePoaps(record.getDistributePoaps())
            .build();
    }
}
