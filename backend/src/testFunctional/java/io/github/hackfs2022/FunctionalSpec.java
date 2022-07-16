package io.github.hackfs2022;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static java.net.http.HttpResponse.BodyHandlers.ofString;

public class FunctionalSpec {

    protected final HttpClient httpClient = HttpClient.newHttpClient();
    protected static final URI serverUri = URI.create("http://localhost:8080");

    static {
        new HackFsApp().start();
    }

    protected HttpResponse<String> sendHttpRequest(HttpRequest request) {
        try {
            return httpClient.send(request, ofString());
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
