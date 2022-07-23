CREATE TABLE events
(
    id               UUID        NOT NULL,
    created_date     TIMESTAMP   NOT NULL,
    updated_date     TIMESTAMP   NOT NULL,
    state            VARCHAR(20) NOT NULL,
    block_number     INTEGER     NOT NULL,
    address          VARCHAR(50) NOT NULL,
    name             VARCHAR     NOT NULL,
    end_date         TIMESTAMP   NOT NULL,
    distribute_poaps BOOLEAN     NOT NULL,

    CONSTRAINT events_pk PRIMARY KEY (id)
);