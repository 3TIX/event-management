package io.github.hackfs2022.repository;

import io.github.hackfs2022.db.schema.tables.records.QrCodeTicketsRecord;
import io.github.hackfs2022.model.QrCodeTicket;
import io.github.hackfs2022.model.QrCodeTicket.Status;
import org.jooq.ConnectionProvider;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.jooq.impl.DefaultConfiguration;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static io.github.hackfs2022.db.schema.Tables.QR_CODE_TICKETS;
import static io.github.hackfs2022.model.QrCodeTicket.Builder.qrCodeTicket;
import static java.time.Clock.systemUTC;
import static java.time.Instant.now;
import static java.util.Optional.empty;
import static org.jooq.impl.DSL.max;

public class QrCodeTicketRepository {

    private final DSLContext db;

    public QrCodeTicketRepository(ConnectionProvider connectionProvider) {
        this.db = DSL.using(new DefaultConfiguration()
            .set(connectionProvider)
            .set(SQLDialect.POSTGRES));
    }

    public QrCodeTicket save(QrCodeTicket ticket) {
        final var result = db.insertInto(QR_CODE_TICKETS)
            .set(toRecord(ticket))
            .returning()
            .fetchOne();

        return fromRecord(result);
    }

    public QrCodeTicket get(UUID id) {
        final var result = find(id);
        if (result.isEmpty()) {
            throw new IllegalArgumentException(String.format("QrCodeTicket[id=%s] is not found", id));
        }

        return result.get();
    }

    public Optional<QrCodeTicket> find(UUID id) {
        final var result = db.selectFrom(QR_CODE_TICKETS)
            .where(QR_CODE_TICKETS.ID.equal(id))
            .fetchOne();
        if (result == null) {
            return empty();
        }

        return Optional.of(fromRecord(result));
    }

    public QrCodeTicket update(QrCodeTicket ticket) {
        final var record = toRecord(ticket);
        record.set(QR_CODE_TICKETS.UPDATED_DATE, now(systemUTC()));
        final var result = db.update(QR_CODE_TICKETS)
            .set(record)
            .where(QR_CODE_TICKETS.ID.equal(ticket.id))
            .execute();
        if (result == 0) {
            throw new IllegalStateException(String.format("QrCodeTicket[id=%s] is not updated", ticket.id));
        }

        return get(ticket.id);
    }

    public Optional<Integer> getLastProcessedBlock() {
        final var maxBlockNumber = max(QR_CODE_TICKETS.BLOCK_NUMBER);
        final var result = db.select(maxBlockNumber)
            .from(QR_CODE_TICKETS)
            .fetchOne(maxBlockNumber);

        if (result == null) {
            return empty();
        }
        return Optional.of(result);
    }

    public List<QrCodeTicket> findAll(Status status) {
        return db.selectFrom(QR_CODE_TICKETS)
            .where(QR_CODE_TICKETS.STATUS.equal(status.name()))
            .fetch()
            .stream()
            .map(this::fromRecord)
            .toList();
    }

    private QrCodeTicketsRecord toRecord(QrCodeTicket ticket) {
        return new QrCodeTicketsRecord(
            ticket.id,
            ticket.createdDate,
            ticket.updatedDate,
            ticket.email,
            ticket.status.name(),
            ticket.validationCode,
            ticket.contractAddress.orElse(null),
            ticket.tokenId.orElse(null),
            ticket.blockNumber.orElse(null),
            ticket.validationTime.orElse(null));
    }

    private QrCodeTicket fromRecord(QrCodeTicketsRecord record) {
        return qrCodeTicket()
            .id(record.getId())
            .createdDate(record.getCreatedDate())
            .updatedDate(record.getUpdatedDate())
            .email(record.getEmail())
            .status(Status.valueOf(record.getStatus()))
            .validationCode(record.getValidationCode())
            .contractAddress(Optional.ofNullable(record.getContractAddress()))
            .tokenId(Optional.ofNullable(record.getTokenId()))
            .blockNumber(Optional.ofNullable(record.getBlockNumber()))
            .validationTime(Optional.ofNullable(record.getVerificationDate()))
            .build();
    }
}
