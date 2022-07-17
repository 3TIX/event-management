package io.github.hackfs2022.http;

import io.github.hackfs2022.http.request.ClaimQrCodeRequest;
import io.github.hackfs2022.http.response.ClaimQrCodeResponse;
import io.github.hackfs2022.json.Json;
import io.github.hackfs2022.repository.QrCodeTicketRepository;
import io.javalin.apibuilder.EndpointGroup;
import io.javalin.http.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.invoke.MethodHandles;

import static io.github.hackfs2022.model.QrCodeTicket.Builder.qrCodeTicket;
import static io.github.hackfs2022.model.QrCodeTicket.Status.CREATED;
import static io.javalin.apibuilder.ApiBuilder.path;
import static io.javalin.apibuilder.ApiBuilder.post;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;

public class QrCodeResource implements Resource {

    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

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
        LOG.info("validateQrCode called with {}", context.body());
    }
}
