package io.github.hackfs2022.http;

import io.github.hackfs2022.exception.TicketNotValidException;
import io.github.hackfs2022.http.request.ClaimQrCodeRequest;
import io.github.hackfs2022.http.request.ValidateQrCodeRequest;
import io.github.hackfs2022.http.response.ClaimQrCodeResponse;
import io.github.hackfs2022.http.response.ValidateQrCodeResponse;
import io.github.hackfs2022.json.Json;
import io.github.hackfs2022.repository.QrCodeTicketRepository;
import io.javalin.apibuilder.EndpointGroup;
import io.javalin.http.Context;

import static io.github.hackfs2022.model.QrCodeTicket.Builder.qrCodeTicket;
import static io.github.hackfs2022.model.QrCodeTicket.Status.CREATED;
import static io.github.hackfs2022.model.QrCodeTicket.Status.QR_CODE_SENT;
import static io.github.hackfs2022.model.QrCodeTicket.Status.QR_CODE_VALIDATED;
import static io.javalin.apibuilder.ApiBuilder.path;
import static io.javalin.apibuilder.ApiBuilder.post;
import static java.time.Clock.systemUTC;
import static java.time.Instant.now;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;

public class QrCodeResource implements Resource {

    private final QrCodeTicketRepository qrCodeTicketRepository;

    public QrCodeResource(QrCodeTicketRepository qrCodeTicketRepository) {
        this.qrCodeTicketRepository = qrCodeTicketRepository;
    }

    @Override
    public EndpointGroup routes() {
        return () -> path("/qr-code", () -> {
            post("/claim", this::claimQrCode);
            post("/validate", this::validateQrCode);
        });
    }

    private void claimQrCode(Context context) {
        final var request = Json.parse(context.body(), ClaimQrCodeRequest.class);
        final var ticket = qrCodeTicketRepository.save(qrCodeTicket()
            .email(request.email())
            .status(CREATED)
            .validationCode(randomAlphanumeric(64))
            .build());
        context.json(new ClaimQrCodeResponse(ticket.id));
    }

    private void validateQrCode(Context context) {
        final var request = Json.parse(context.body(), ValidateQrCodeRequest.class);
        final var ticket = qrCodeTicketRepository.get(request.id());
        if (!ticket.validationCode.equals(request.validationCode())) {
            throw new TicketNotValidException();
        }

        if (ticket.status == QR_CODE_VALIDATED) {
            context.json(new ValidateQrCodeResponse(true, ticket.validationTime.orElseThrow()));
            return;
        }

        if (ticket.status != QR_CODE_SENT) {
            throw new TicketNotValidException();
        }

        final var validationDate = now(systemUTC());
        qrCodeTicketRepository.update(ticket.validated(validationDate));
        context.json(new ValidateQrCodeResponse(false, validationDate));
    }
}
