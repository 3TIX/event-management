package io.github.hackfs2022.job;

import com.google.common.util.concurrent.AbstractScheduledService;
import io.github.hackfs2022.repository.EventRepository;
import io.github.hackfs2022.service.TheGraphService;
import io.github.hackfs2022.service.TheGraphService.CreatedEventInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.invoke.MethodHandles;
import java.time.Instant;

import static com.google.common.util.concurrent.AbstractScheduledService.Scheduler.newFixedRateSchedule;
import static io.github.hackfs2022.model.Event.Builder.event;
import static io.github.hackfs2022.model.Event.State.CREATED;
import static io.github.hackfs2022.model.Event.State.PROCESSED;
import static java.lang.Integer.parseInt;
import static java.util.concurrent.TimeUnit.MINUTES;

public class EventCreationJob extends AbstractScheduledService {

    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final EventRepository eventRepository;
    private final TheGraphService theGraphService;

    public EventCreationJob(EventRepository eventRepository, TheGraphService theGraphService) {
        this.eventRepository = eventRepository;
        this.theGraphService = theGraphService;
    }

    @Override
    protected void runOneIteration() {
        LOG.info("Starting EventCreationJob execution");
        final var lastProcessedBlock = eventRepository.getLastProcessedBlock().orElse(0);
        theGraphService.getEvents(lastProcessedBlock)
            .forEach(this::createEvent);

        LOG.info("EventCreationJob successfully finished");
    }

    private void createEvent(CreatedEventInfo event) {
        eventRepository.save(event()
            .state(event.distributePoaps() ? CREATED : PROCESSED)
            .blockNumber(parseInt(event.blockNumber()))
            .address(event.id())
            .name(event.name())
            .endDate(Instant.ofEpochSecond(parseInt(event.endDate())))
            .distributePoaps(event.distributePoaps())
            .build());
    }

    @Override
    protected Scheduler scheduler() {
        return newFixedRateSchedule(1, 1, MINUTES);
    }
}
