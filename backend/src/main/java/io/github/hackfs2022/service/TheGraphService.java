package io.github.hackfs2022.service;

import io.github.hackfs2022.json.Json;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.List;
import java.util.UUID;

import static io.github.hackfs2022.json.Json.object;
import static io.github.hackfs2022.json.Json.parseTree;

public class TheGraphService {

    private static final URI API_URI = URI.create("https://api.thegraph.com/subgraphs/name/hackfs2022/subgraph");
    private static final String QR_CODE_CLAIMED_QUERY = """
        query ClaimedQrCodes($fromBlock: String!) {
          qrCodeClaimeds(where: {blockNumber_gt: $fromBlock}) {
            id
            eventAddress
            tokenId
            blockNumber
          }
        }""";

    private final HttpClient httpClient;

    public TheGraphService(HttpClient httpClient) {
        this.httpClient = httpClient;
    }

    public List<QrCodeClaimedEvent> getClaimedQrCodes(int fromBlock) {
        final var jsonNode = object()
            .put("query", QR_CODE_CLAIMED_QUERY)
            .set("variables", object()
                .put("fromBlock", String.valueOf(fromBlock)));

        final var request = HttpRequest.newBuilder(API_URI)
            .POST(BodyPublishers.ofString(jsonNode.toString()))
            .build();

        try {
            final var response = httpClient.send(request, BodyHandlers.ofString());
            final var parsedResponse = parseTree(response.body())
                .get("data")
                .get("qrCodeClaimeds");
            return Json.parseList(parsedResponse, QrCodeClaimedEvent.class);
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public record QrCodeClaimedEvent(UUID id, String eventAddress, int tokenId, String blockNumber) {

    }
}
