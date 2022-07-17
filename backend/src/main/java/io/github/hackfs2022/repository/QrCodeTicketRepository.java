package io.github.hackfs2022.repository;

import io.github.hackfs2022.db.schema.tables.records.QrCodeTicketsRecord;
import io.github.hackfs2022.model.QrCodeTicket;
import io.github.hackfs2022.model.QrCodeTicket.Status;
import org.jooq.ConnectionProvider;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.jooq.impl.DefaultConfiguration;

import java.util.Optional;
import java.util.UUID;

import static io.github.hackfs2022.db.schema.Tables.QR_CODE_TICKETS;
import static io.github.hackfs2022.model.QrCodeTicket.Builder.qrCodeTicket;

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
        final var result = db.selectFrom(QR_CODE_TICKETS)
            .where(QR_CODE_TICKETS.ID.equal(id))
            .fetchOne();
        if (result == null) {
            throw new IllegalArgumentException(String.format("QrCodeTicket[id=%s] is not found", id));
        }

        return fromRecord(result);

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
            ticket.verificationDate.orElse(null));
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
            .verificationDate(Optional.ofNullable(record.getVerificationDate()))
            .build();
    }
}
