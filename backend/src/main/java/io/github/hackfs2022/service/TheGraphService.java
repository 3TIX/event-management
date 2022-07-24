package io.github.hackfs2022.service;

import com.fasterxml.jackson.databind.JsonNode;
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
    private static final String EVENTS_QUERY = """
        query CreatedEvents($fromBlock: String!) {
          createdEvents(orderBy: blockNumber, where: {blockNumber_gt: $fromBlock}) {
            id
            blockNumber
            name
            endDate
            distributePoaps
          }
        }""";
    private static final String EVENT_BY_ID_QUERY = """
        query EventById($id: String!) {
          createdEvents(where: {id: $id}) {
            id
            cid
            creatorAddress
            name
            description
            image
            isOnline
            location
            startDate
            endDate
            organiserEmail
            ticketCount
            ticketPrice
            ticketCurrency
            royaltyPercentage
            distributePoaps
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
        final var response = sendRequest(request)
            .get("data")
            .get("qrCodeClaimeds");
        return Json.parseList(response, QrCodeClaimedEvent.class);
    }

    public record QrCodeClaimedEvent(UUID id, String eventAddress, int tokenId, String blockNumber) {

    }

    public List<CreatedEventInfo> getEvents(int fromBlock) {
        final var jsonNode = object()
            .put("query", EVENTS_QUERY)
            .set("variables", object()
                .put("fromBlock", String.valueOf(fromBlock)));

        final var request = HttpRequest.newBuilder(API_URI)
            .POST(BodyPublishers.ofString(jsonNode.toString()))
            .build();
        final var response = sendRequest(request)
            .get("data")
            .get("createdEvents");
        return Json.parseList(response, CreatedEventInfo.class);
    }

    public record CreatedEventInfo(String id, String blockNumber, String name, String endDate, boolean distributePoaps) {

    }

    private JsonNode sendRequest(HttpRequest httpRequest) {
        try {
            final var response = httpClient.send(httpRequest, BodyHandlers.ofString());
            return parseTree(response.body());
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public FullEvent getEvent(String address) {
        final var jsonNode = object()
            .put("query", EVENT_BY_ID_QUERY)
            .set("variables", object()
                .put("id", address));

        final var request = HttpRequest.newBuilder(API_URI)
            .POST(BodyPublishers.ofString(jsonNode.toString()))
            .build();
        final var response = sendRequest(request)
            .get("data")
            .get("createdEvents");
        return Json.parse(response, FullEvent.class);
    }

    public record FullEvent(
        String id,
        String cid,
        String creatorAddress,
        String name,
        String description,
        String image,
        boolean isOnline,
        String location,
        int startDate,
        int endDate,
        String organiserEmail,
        String ticketCount,
        String ticketPrice,
        String ticketCurrency,
        String royaltyPercentage,
        String distributePoaps
    ) {

    }
}
