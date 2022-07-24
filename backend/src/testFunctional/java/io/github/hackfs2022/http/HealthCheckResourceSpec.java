package io.github.hackfs2022.http;

import io.github.hackfs2022.FunctionalSpec;
import io.github.hackfs2022.json.Json;
import org.junit.jupiter.api.Test;

import java.net.http.HttpRequest;

import static io.github.hackfs2022.json.Json.object;
import static java.net.HttpURLConnection.HTTP_OK;
import static org.assertj.core.api.Assertions.assertThat;

public class HealthCheckResourceSpec extends FunctionalSpec {

    @Test
    void should_return_200() {
        // given
        final var request = HttpRequest.newBuilder(serverUri.resolve("/healthcheck"))
            .GET()
            .build();

        final var expectedResponse = object().put("health", "OK");

        // when
        final var response = sendHttpRequest(request);

        // then
        assertThat(response.statusCode()).isEqualTo(HTTP_OK);
        assertThat(Json.parseTree(response.body())).isEqualTo(expectedResponse);
    }
}
