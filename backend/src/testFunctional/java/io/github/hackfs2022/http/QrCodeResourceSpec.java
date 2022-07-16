package io.github.hackfs2022.http;

import io.github.hackfs2022.FunctionalSpec;
import io.github.hackfs2022.http.request.ClaimQrCodeRequest;
import io.github.hackfs2022.http.response.ClaimQrCodeResponse;
import io.github.hackfs2022.json.Json;
import org.junit.jupiter.api.Test;

import java.net.http.HttpRequest;

import static io.github.hackfs2022.json.Json.toJsonString;
import static io.github.hackfs2022.model.QrCodeTicket.Status.CREATED;
import static java.net.HttpURLConnection.HTTP_OK;
import static java.net.http.HttpRequest.BodyPublishers.noBody;
import static java.net.http.HttpRequest.BodyPublishers.ofString;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;

public class QrCodeResourceSpec extends FunctionalSpec {

    @Test
    void should_return_200_when_claim_qr_code_called() {
        // given
        final var email = randomAlphanumeric(10);
        final var claimQrCodeRequest = new ClaimQrCodeRequest(email);
        final var request = HttpRequest.newBuilder(serverUri.resolve("/qr-code/claim"))
            .POST(ofString(toJsonString(claimQrCodeRequest)))
            .build();

        // when
        final var response = sendHttpRequest(request);

        // then
        assertThat(response.statusCode()).isEqualTo(HTTP_OK);

        final var claimQrCodeResponse = Json.parse(response.body(), ClaimQrCodeResponse.class);

        final var ticket = qrCodeTicketRepository.get(claimQrCodeResponse.id());
        assertThat(ticket.email).isEqualTo(email);
        assertThat(ticket.status).isEqualTo(CREATED);
        assertThat(ticket.validationCode).isNotEmpty();
    }

    @Test
    void should_return_200_when_validate_qr_code_called() {
        // given
        final var request = HttpRequest.newBuilder(serverUri.resolve("/qr-code/validate"))
            .POST(noBody())
            .build();

        // when
        final var response = sendHttpRequest(request);

        // then
        assertThat(response.statusCode()).isEqualTo(HTTP_OK);
        assertThat(response.body()).isEmpty();
    }
}
