CREATE TABLE qr_code_tickets
(
    id                UUID         NOT NULL,
    created_date      TIMESTAMP    NOT NULL,
    updated_date      TIMESTAMP    NOT NULL,
    email             VARCHAR(128) NOT NULL,
    status            VARCHAR(20)  NOT NULL,
    validation_code   VARCHAR(64)  NOT NULL,
    contract_address  VARCHAR(50),
    token_id          INTEGER,
    block_number      INTEGER,
    verification_date TIMESTAMP,

    CONSTRAINT claims_pk PRIMARY KEY (id)
);

CREATE UNIQUE INDEX qr_code_tickets_contract_address_token_id_unique_index ON qr_code_tickets (contract_address, token_id);