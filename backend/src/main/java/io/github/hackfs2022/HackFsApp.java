package io.github.hackfs2022;

import com.google.common.util.concurrent.ServiceManager;
import io.github.hackfs2022.http.QrCodeResource;
import io.github.hackfs2022.job.QrCodeTicketDistributionJob;
import io.github.hackfs2022.repository.QrCodeTicketRepository;
import io.github.hackfs2022.service.TheGraphService;
import io.javalin.Javalin;
import io.javalin.plugin.json.JavalinJackson;
import org.flywaydb.core.Flyway;
import org.jooq.impl.DataSourceConnectionProvider;
import org.postgresql.ds.PGSimpleDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.Optional;

import static io.github.hackfs2022.json.Json.OBJECT_MAPPER;
import static java.lang.Runtime.getRuntime;
import static java.net.http.HttpClient.newHttpClient;

public class HackFsApp {

    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static void main(String[] args) {
        new HackFsApp().start();
    }

    void start() {
        LOG.info("Starting HackFS app");

        final var dataSource = getDataSource();
        migrateDbSchema(dataSource);

        final var connectionProvider = new DataSourceConnectionProvider(dataSource);
        final var qrCodeTicketRepository = new QrCodeTicketRepository(connectionProvider);

        final var theGraphService = new TheGraphService(newHttpClient());

        final var serviceManager = new ServiceManager(List.of(new QrCodeTicketDistributionJob(qrCodeTicketRepository, theGraphService)));
        getRuntime().addShutdownHook(new Thread(serviceManager::stopAsync));
        serviceManager.startAsync();
        serviceManager.awaitHealthy();

        final var javalin = Javalin.create(javalinConfig -> {
            javalinConfig.enableCorsForAllOrigins();
            javalinConfig.jsonMapper(new JavalinJackson(OBJECT_MAPPER));
        });
        getRuntime().addShutdownHook(new Thread(javalin::stop));
        javalin.routes(new QrCodeResource(qrCodeTicketRepository).routes());
        javalin.start(8080);

        LOG.info("HackFS app started");
    }

    private void migrateDbSchema(DataSource dataSource) {
        Flyway.configure()
            .dataSource(dataSource)
            .locations("classpath:migrations")
            .load()
            .migrate();
    }

    private DataSource getDataSource() {
        final var dataSource = new PGSimpleDataSource();
        dataSource.setURL(getFromEnv("HACK_FS_DATABASE_URL"));
        dataSource.setUser(getFromEnv("HACK_FS_DATABASE_USER"));
        dataSource.setPassword(getFromEnv("HACK_FS_DATABASE_PASSWORD"));
        return dataSource;
    }

    private String getFromEnv(String name) {
        return Optional.ofNullable(System.getenv(name))
            .orElseGet(() -> System.getProperty(name));
    }
}
