package io.github.hackfs2022.http;

import io.github.hackfs2022.FunctionalSpec;
import io.github.hackfs2022.http.request.ClaimQrCodeRequest;
import io.github.hackfs2022.http.request.ValidateQrCodeRequest;
import io.github.hackfs2022.http.response.ClaimQrCodeResponse;
import io.github.hackfs2022.http.response.ErrorResponse;
import io.github.hackfs2022.http.response.ValidateQrCodeResponse;
import io.github.hackfs2022.json.Json;
import io.github.hackfs2022.model.QrCodeTicket;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.net.http.HttpRequest;
import java.util.Optional;

import static io.github.hackfs2022.json.Json.toJsonString;
import static io.github.hackfs2022.model.QrCodeTicket.Builder.qrCodeTicket;
import static io.github.hackfs2022.model.QrCodeTicket.Status.CREATED;
import static io.github.hackfs2022.model.QrCodeTicket.Status.QR_CODE_SENT;
import static io.github.hackfs2022.model.QrCodeTicket.Status.QR_CODE_VALIDATED;
import static java.net.HttpURLConnection.HTTP_BAD_REQUEST;
import static java.net.HttpURLConnection.HTTP_OK;
import static java.net.http.HttpRequest.BodyPublishers.ofString;
import static java.time.Clock.systemUTC;
import static java.time.Instant.now;
import static java.time.temporal.ChronoUnit.MINUTES;
import static java.time.temporal.ChronoUnit.SECONDS;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.EnumSource.Mode.EXCLUDE;

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
    void should_validate_qr_code() {
        // given
        final var qrCodeTicket = qrCodeTicketRepository.save(qrCodeTicket()
            .email(randomAlphanumeric(10))
            .status(QR_CODE_SENT)
            .validationCode(randomAlphanumeric(64))
            .build());

        final var validateQrCodeRequest = new ValidateQrCodeRequest(qrCodeTicket.id, qrCodeTicket.validationCode);
        final var request = HttpRequest.newBuilder(serverUri.resolve("/qr-code/validate"))
            .POST(ofString(toJsonString(validateQrCodeRequest)))
            .build();

        // when
        final var response = sendHttpRequest(request);

        // then
        assertThat(response.statusCode()).isEqualTo(HTTP_OK);

        final var validateQrCodeResponse = Json.parse(response.body(), ValidateQrCodeResponse.class);
        assertThat(validateQrCodeResponse.previouslyValidated()).isFalse();
        final var now = now(systemUTC());
        assertThat(validateQrCodeResponse.validationTime()).isBetween(now.minus(5, SECONDS), now);

        final var updatedTicket = qrCodeTicketRepository.get(qrCodeTicket.id);
        assertThat(updatedTicket.status).isEqualTo(QR_CODE_VALIDATED);
        assertThat(updatedTicket.validationTime).hasValue(validateQrCodeResponse.validationTime());
    }

    @Test
    void should_return_previously_validated_flag() {
        // given
        final var validationTime = now(systemUTC()).minus(10, MINUTES);
        final var qrCodeTicket = qrCodeTicketRepository.save(qrCodeTicket()
            .email(randomAlphanumeric(10))
            .status(QR_CODE_VALIDATED)
            .validationCode(randomAlphanumeric(64))
            .validationTime(Optional.of(validationTime))
            .build());

        final var validateQrCodeRequest = new ValidateQrCodeRequest(qrCodeTicket.id, qrCodeTicket.validationCode);
        final var request = HttpRequest.newBuilder(serverUri.resolve("/qr-code/validate"))
            .POST(ofString(toJsonString(validateQrCodeRequest)))
            .build();

        // when
        final var response = sendHttpRequest(request);

        // then
        assertThat(response.statusCode()).isEqualTo(HTTP_OK);

        final var validateQrCodeResponse = Json.parse(response.body(), ValidateQrCodeResponse.class);
        assertThat(validateQrCodeResponse.previouslyValidated()).isTrue();
        assertThat(validateQrCodeResponse.validationTime()).isEqualTo(validationTime);
    }

    @Test
    void should_fail_if_not_valid_code() {
        // given
        final var qrCodeTicket = qrCodeTicketRepository.save(qrCodeTicket()
            .email(randomAlphanumeric(10))
            .status(QR_CODE_SENT)
            .validationCode(randomAlphanumeric(64))
            .build());

        final var validateQrCodeRequest = new ValidateQrCodeRequest(qrCodeTicket.id, randomAlphanumeric(64));
        final var request = HttpRequest.newBuilder(serverUri.resolve("/qr-code/validate"))
            .POST(ofString(toJsonString(validateQrCodeRequest)))
            .build();

        // when
        final var response = sendHttpRequest(request);

        // then
        assertThat(response.statusCode()).isEqualTo(HTTP_BAD_REQUEST);

        final var errorResponse = Json.parse(response.body(), ErrorResponse.class);
        assertThat(errorResponse.message()).isEqualTo("Ticket is not valid");
    }

    @ParameterizedTest
    @EnumSource(value = QrCodeTicket.Status.class, mode = EXCLUDE, names = {"QR_CODE_SENT", "QR_CODE_VALIDATED"})
    void should_fail_if_not_expected_status(QrCodeTicket.Status status) {
        // given
        final var qrCodeTicket = qrCodeTicketRepository.save(qrCodeTicket()
            .email(randomAlphanumeric(10))
            .status(status)
            .validationCode(randomAlphanumeric(64))
            .build());

        final var validateQrCodeRequest = new ValidateQrCodeRequest(qrCodeTicket.id, qrCodeTicket.validationCode);
        final var request = HttpRequest.newBuilder(serverUri.resolve("/qr-code/validate"))
            .POST(ofString(toJsonString(validateQrCodeRequest)))
            .build();

        // when
        final var response = sendHttpRequest(request);

        // then
        assertThat(response.statusCode()).isEqualTo(HTTP_BAD_REQUEST);

        final var errorResponse = Json.parse(response.body(), ErrorResponse.class);
        assertThat(errorResponse.message()).isEqualTo("Ticket is not valid");
    }
}
