package io.github.hackfs2022.http;

import io.github.hackfs2022.FunctionalSpec;
import org.junit.jupiter.api.Test;

import java.net.http.HttpRequest;

import static java.net.HttpURLConnection.HTTP_OK;
import static java.net.http.HttpRequest.BodyPublishers.noBody;
import static org.assertj.core.api.Assertions.assertThat;

public class QrCodeResourceSpec extends FunctionalSpec {

    @Test
    void should_return_200_when_claim_qr_code_called() {
        // given
        final var request = HttpRequest.newBuilder(serverUri.resolve("/qr-code/claim"))
            .POST(noBody())
            .build();

        // when
        final var response = sendHttpRequest(request);

        // then
        assertThat(response.statusCode()).isEqualTo(HTTP_OK);
        assertThat(response.body()).isEmpty();
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
