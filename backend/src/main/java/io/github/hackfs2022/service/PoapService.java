package io.github.hackfs2022.service;

import io.github.hackfs2022.service.TheGraphService.FullEvent;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.net.URI;
import java.time.Instant;
import java.time.LocalDate;

import static io.github.hackfs2022.json.Json.parseTree;
import static java.time.ZoneOffset.UTC;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.apache.http.entity.ContentType.IMAGE_PNG;
import static org.apache.http.entity.ContentType.MULTIPART_FORM_DATA;

public class PoapService {

    private static final URI POAP_URI = URI.create("https://api.poap.tech");

    private final String apiKey;
    private final HttpClient httpClient;

    public PoapService(String apiKey) {
        this.apiKey = apiKey;
        this.httpClient = HttpClientBuilder.create().build();
    }

    public PoapEvent createEvent(FullEvent event) {
        final var request = new HttpPost(POAP_URI.resolve("/events"));
        request.addHeader("X-API-Key", apiKey);
        try {
            final var secretCode = randomNumeric(6);

            final var startDate = LocalDate.ofInstant(Instant.ofEpochSecond(event.startDate()), UTC);
            final var endDate = LocalDate.ofInstant(Instant.ofEpochSecond(event.endDate()), UTC);

            request.setEntity(MultipartEntityBuilder.create()
                .addPart("image", new StringBody(event.image(), IMAGE_PNG))
                .addPart("name", new StringBody(event.name(), MULTIPART_FORM_DATA))
                .addPart("description", new StringBody("Testing for ETHGlobal hackathon", MULTIPART_FORM_DATA))
                .addPart("city", new StringBody(event.isOnline() ? "Online" : event.location(), MULTIPART_FORM_DATA))
                .addPart("country", new StringBody(event.isOnline() ? "Online" : event.location(), MULTIPART_FORM_DATA))
                .addPart("start_date", new StringBody(startDate.toString(), MULTIPART_FORM_DATA))
                .addPart("end_date", new StringBody(endDate.toString(), MULTIPART_FORM_DATA))
                .addPart("expiry_date", new StringBody(endDate.plusMonths(1).toString(), MULTIPART_FORM_DATA))
                .addPart("year", new StringBody(String.valueOf(endDate.getYear()), MULTIPART_FORM_DATA))
                .addPart("event_url", new StringBody(event.location(), MULTIPART_FORM_DATA))
                .addPart("virtual_event", new StringBody(String.valueOf(event.isOnline()), MULTIPART_FORM_DATA))
                .addPart("secret_code", new StringBody(secretCode, MULTIPART_FORM_DATA))
                .addPart("email", new StringBody(event.organiserEmail(), MULTIPART_FORM_DATA))
                .addPart("requested_codes", new StringBody(event.ticketCount(), MULTIPART_FORM_DATA))
                .addPart("private_event", new StringBody("true", MULTIPART_FORM_DATA))
                .build());

            final var response = httpClient.execute(request);
            final var jsonResponse = parseTree(EntityUtils.toString(response.getEntity()));

            return new PoapEvent(jsonResponse.get("id").asInt(), secretCode);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public record PoapEvent(int id, String secretCode) {

    }
}

