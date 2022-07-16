package io.github.hackfs2022;

import io.github.hackfs2022.repository.QrCodeTicketRepository;
import org.jooq.impl.DataSourceConnectionProvider;
import org.postgresql.ds.PGSimpleDataSource;
import org.testcontainers.containers.PostgreSQLContainer;

import javax.sql.DataSource;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static java.net.http.HttpResponse.BodyHandlers.ofString;

public class FunctionalSpec {

    protected static final URI serverUri = URI.create("http://localhost:8080");
    protected static final QrCodeTicketRepository qrCodeTicketRepository;

    protected final HttpClient httpClient = HttpClient.newHttpClient();

    static {
        final var dbContainer = new PostgreSQLContainer<>("postgres:14");
        dbContainer.start();

        System.setProperty("HACK_FS_DATABASE_URL", dbContainer.getJdbcUrl());
        System.setProperty("HACK_FS_DATABASE_USER", dbContainer.getUsername());
        System.setProperty("HACK_FS_DATABASE_PASSWORD", dbContainer.getPassword());

        final var connectionProvider = new DataSourceConnectionProvider(toDataSource(dbContainer));
        qrCodeTicketRepository = new QrCodeTicketRepository(connectionProvider);

        new HackFsApp().start();
    }

    private static DataSource toDataSource(PostgreSQLContainer<?> dbContainer) {
        final var dataSource = new PGSimpleDataSource();
        dataSource.setURL(dbContainer.getJdbcUrl());
        dataSource.setUser(dbContainer.getUsername());
        dataSource.setPassword(dbContainer.getPassword());
        return dataSource;
    }

    protected HttpResponse<String> sendHttpRequest(HttpRequest request) {
        try {
            return httpClient.send(request, ofString());
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
