package io.github.hackfs2022.job;

import com.google.common.util.concurrent.AbstractScheduledService;
import io.github.hackfs2022.model.QrCodeTicket;
import io.github.hackfs2022.repository.QrCodeTicketRepository;
import io.github.hackfs2022.service.MailService;
import io.github.hackfs2022.service.QrCodeGenerator;
import io.github.hackfs2022.service.TheGraphService;
import io.github.hackfs2022.service.TheGraphService.QrCodeClaimedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileOutputStream;
import java.lang.invoke.MethodHandles;

import static com.google.common.util.concurrent.AbstractScheduledService.Scheduler.newFixedRateSchedule;
import static io.github.hackfs2022.model.QrCodeTicket.Status.CREATED;
import static io.github.hackfs2022.model.QrCodeTicket.Status.NFT_BURNED;
import static java.io.File.createTempFile;
import static java.lang.Integer.parseInt;
import static java.util.UUID.randomUUID;
import static java.util.concurrent.TimeUnit.MINUTES;

public class QrCodeTicketDistributionJob extends AbstractScheduledService {

    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final QrCodeTicketRepository qrCodeTicketRepository;
    private final TheGraphService theGraphService;
    private final QrCodeGenerator qrCodeGenerator;
    private final MailService mailService;

    public QrCodeTicketDistributionJob(QrCodeTicketRepository qrCodeTicketRepository,
                                       TheGraphService theGraphService,
                                       QrCodeGenerator qrCodeGenerator,
                                       MailService mailService) {
        this.qrCodeTicketRepository = qrCodeTicketRepository;
        this.theGraphService = theGraphService;
        this.qrCodeGenerator = qrCodeGenerator;
        this.mailService = mailService;
    }

    @Override
    protected void runOneIteration() {
        LOG.info("Starting QrCodeTicketDistributionJob execution");
        final var lastProcessedBlock = qrCodeTicketRepository.getLastProcessedBlock().orElse(0);
        theGraphService.getClaimedQrCodes(lastProcessedBlock)
            .forEach(this::markAsBurned);

        qrCodeTicketRepository.findAll(NFT_BURNED)
            .forEach(this::sendTicket);

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

    private void sendTicket(QrCodeTicket ticket) {
        try {
            final var qrCode = qrCodeGenerator.generate(ticket.id + ":" + ticket.validationCode);

            final var tempFile = createTempFile("qr-code-images", randomUUID().toString());
            final var fileOutputStream = new FileOutputStream(tempFile);
            fileOutputStream.write(qrCode);
            fileOutputStream.close();

            mailService.sendMessage(ticket.email, "Your ticket", tempFile);
            qrCodeTicketRepository.update(ticket.qrCodeSent());

            tempFile.delete();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
