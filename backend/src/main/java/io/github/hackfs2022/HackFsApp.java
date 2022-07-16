package io.github.hackfs2022;

import io.github.hackfs2022.http.QrCodeResource;
import io.javalin.Javalin;
import io.javalin.plugin.json.JavalinJackson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.invoke.MethodHandles;

import static io.github.hackfs2022.json.Json.OBJECT_MAPPER;
import static java.lang.Runtime.getRuntime;

public class HackFsApp {

    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static void main(String[] args) {
        new HackFsApp().start();
    }

    void start() {
        LOG.info("Starting HackFS app");

        final var javalin = Javalin.create(javalinConfig -> {
            javalinConfig.enableCorsForAllOrigins();
            javalinConfig.jsonMapper(new JavalinJackson(OBJECT_MAPPER));
        });
        javalin.routes(new QrCodeResource().routes());
        javalin.start(8080);
        getRuntime().addShutdownHook(new Thread(javalin::stop));

        LOG.info("HackFS app started");
    }
}
