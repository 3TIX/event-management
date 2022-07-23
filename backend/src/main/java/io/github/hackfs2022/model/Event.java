package io.github.hackfs2022.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

import static java.time.Clock.systemUTC;
import static java.time.Instant.now;
import static java.util.UUID.randomUUID;

public class Event {

    public final UUID id;
    public final Instant createdDate;
    public final Instant updatedDate;
    public final State state;
    public final Integer blockNumber;
    public final String address;
    public final String name;
    public final Instant endDate;
    public final boolean distributePoaps;

    public Event(Builder builder) {
        this.id = builder.id;
        this.createdDate = builder.createdDate;
        this.updatedDate = builder.updatedDate != null ? builder.updatedDate : builder.createdDate;
        this.state = builder.state;
        this.blockNumber = builder.blockNumber;
        this.address = builder.address;
        this.name = builder.name;
        this.endDate = builder.endDate;
        this.distributePoaps = builder.distributePoaps;
    }

    public enum State {
        CREATED,
        POAPS_REQUESTED,
        PROCESSED
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        final Event event = (Event) o;
        return distributePoaps == event.distributePoaps &&
            Objects.equals(id, event.id) &&
            Objects.equals(createdDate, event.createdDate) &&
            Objects.equals(updatedDate, event.updatedDate) &&
            state == event.state &&
            Objects.equals(blockNumber, event.blockNumber) &&
            Objects.equals(address, event.address) &&
            Objects.equals(name, event.name) &&
            Objects.equals(endDate, event.endDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, createdDate, updatedDate, state, blockNumber, address, name, endDate, distributePoaps);
    }

    public static final class Builder {

        private UUID id;
        private Instant createdDate = now(systemUTC());
        private Instant updatedDate;
        private State state;
        private Integer blockNumber;
        private String address;
        private String name;
        private Instant endDate;
        private boolean distributePoaps;

        private Builder() {
        }

        public static Builder event() {
            return new Builder().id(randomUUID());
        }

        public Builder id(UUID id) {
            this.id = id;
            return this;
        }

        public Builder createdDate(Instant createdDate) {
            this.createdDate = createdDate;
            return this;
        }

        public Builder updatedDate(Instant updatedDate) {
            this.updatedDate = updatedDate;
            return this;
        }

        public Builder state(State state) {
            this.state = state;
            return this;
        }

        public Builder blockNumber(Integer blockNumber) {
            this.blockNumber = blockNumber;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder endDate(Instant endDate) {
            this.endDate = endDate;
            return this;
        }

        public Builder distributePoaps(boolean distributePoaps) {
            this.distributePoaps = distributePoaps;
            return this;
        }

        public Event build() {
            return new Event(this);
        }
    }
}
