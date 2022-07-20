package io.github.hackfs2022.http;

import io.github.hackfs2022.exception.TicketNotValidException;
import io.github.hackfs2022.http.response.ErrorResponse;
import io.javalin.Javalin;
import io.javalin.http.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.invoke.MethodHandles;

import static java.net.HttpURLConnection.HTTP_BAD_REQUEST;
import static java.net.HttpURLConnection.HTTP_INTERNAL_ERROR;

public class ExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static void register(Javalin javalin) {
        javalin.exception(TicketNotValidException.class, (e, context) -> handleWithStackTraceLog(e, context, HTTP_BAD_REQUEST));
        javalin.exception(Exception.class, (e, context) -> handleWithStackTraceLog(e, context, HTTP_INTERNAL_ERROR));
    }

    private static void handleWithStackTraceLog(Exception exception, Context context, int statusCode) {
        LOG.error("", exception);
        handle(exception, context, statusCode);
    }

    private static void handle(Exception exception, Context context, int statusCode) {
        context.json(new ErrorResponse(exception.getMessage()));
        context.status(statusCode);
    }
}
