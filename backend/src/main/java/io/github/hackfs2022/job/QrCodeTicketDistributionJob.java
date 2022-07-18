package io.github.hackfs2022.job;

import com.google.common.util.concurrent.AbstractScheduledService;
import io.github.hackfs2022.repository.QrCodeTicketRepository;
import io.github.hackfs2022.service.TheGraphService;
import io.github.hackfs2022.service.TheGraphService.QrCodeClaimedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.invoke.MethodHandles;

import static com.google.common.util.concurrent.AbstractScheduledService.Scheduler.newFixedRateSchedule;
import static io.github.hackfs2022.model.QrCodeTicket.Status.CREATED;
import static java.lang.Integer.parseInt;
import static java.util.concurrent.TimeUnit.MINUTES;

public class QrCodeTicketDistributionJob extends AbstractScheduledService {

    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final QrCodeTicketRepository qrCodeTicketRepository;
    private final TheGraphService theGraphService;

    public QrCodeTicketDistributionJob(QrCodeTicketRepository qrCodeTicketRepository,
                                       TheGraphService theGraphService) {
        this.qrCodeTicketRepository = qrCodeTicketRepository;
        this.theGraphService = theGraphService;
    }

    @Override
    protected void runOneIteration() {
        LOG.info("Starting QrCodeTicketDistributionJob execution");
        final var lastProcessedBlock = qrCodeTicketRepository.getLastProcessedBlock().orElse(0);
        theGraphService.getClaimedQrCodes(lastProcessedBlock)
            .forEach(this::markAsBurned);

        LOG.info("QrCodeTicketDistributionJob successfully finished");
    }

    @Override
    protected Scheduler scheduler() {
        return newFixedRateSchedule(1, 1, MINUTES);
    }

    private void markAsBurned(QrCodeClaimedEvent event) {
        final var qrCodeTicket = qrCodeTicketRepository.find(event.id());
        if (qrCodeTicket.isEmpty() || qrCodeTicket.map(t -> t.status != CREATED).orElse(false)) {
            return;
        }

        final var ticket = qrCodeTicket.get();
        qrCodeTicketRepository.update(ticket.nftBurned(event.eventAddress(), event.tokenId(), parseInt(event.blockNumber())));
    }
}
