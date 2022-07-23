package io.github.hackfs2022.http;

import io.javalin.apibuilder.EndpointGroup;
import io.javalin.http.Context;

import static io.github.hackfs2022.json.Json.object;
import static io.javalin.apibuilder.ApiBuilder.get;

public class HealthCheckResource implements Resource {

    @Override
    public EndpointGroup routes() {
        return () -> get("/healthcheck", this::healthCheck);
    }

    private void healthCheck(Context context) {
        context.json(object().put("health", "OK"));
    }
}
