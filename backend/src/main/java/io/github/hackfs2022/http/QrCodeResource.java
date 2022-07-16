package io.github.hackfs2022.http;

import io.javalin.apibuilder.EndpointGroup;
import io.javalin.http.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.invoke.MethodHandles;

import static io.javalin.apibuilder.ApiBuilder.path;
import static io.javalin.apibuilder.ApiBuilder.post;

public class QrCodeResource implements Resource {

    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Override
    public EndpointGroup routes() {
        return () -> path("/qr-code", () -> {
            post("/claim", this::claimQrCode);
            post("/validate", this::validateQrCode);
        });
    }

    private void claimQrCode(Context context) {
        LOG.info("claimQrCode called with {}", context.body());
    }

    private void validateQrCode(Context context) {
        LOG.info("validateQrCode called with {}", context.body());
    }
}
