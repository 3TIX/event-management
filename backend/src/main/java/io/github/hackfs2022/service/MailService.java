package io.github.hackfs2022.service;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.File;
import java.util.Properties;

import static javax.mail.Message.RecipientType.TO;
import static javax.mail.Part.INLINE;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;

public class MailService {

    private final Session session;

    public MailService(String username, String password) {
        final var mailProperties = new Properties();
        mailProperties.put("mail.smtp.auth", true);
        mailProperties.put("mail.smtp.starttls.enable", true);
        mailProperties.put("mail.smtp.host", "smtp.gmail.com");
        mailProperties.put("mail.smtp.port", "587");
        mailProperties.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        mailProperties.put("mail.smtp.ssl.protocols", "TLSv1.2");

        this.session = Session.getInstance(mailProperties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
    }

    public void sendMessage(String to, String subject, File qrCode) throws Exception {
        final var messagePart = new MimeBodyPart();
        final var cid = randomAlphanumeric(20);
        messagePart.setContent(String.format("<html><img src=\"cid:%s\"/></html>", cid), "text/html");

        final var imagePart = new MimeBodyPart();
        imagePart.setContentID("<" + cid + ">");
        imagePart.setDisposition(INLINE);
        imagePart.attachFile(qrCode);

        final var multipart = new MimeMultipart();
        multipart.addBodyPart(messagePart);
        multipart.addBodyPart(imagePart);

        final var message = new MimeMessage(session);
        message.setFrom(new InternetAddress("hackfs.tickets@gmail.com"));
        message.setRecipients(TO, InternetAddress.parse(to));
        message.setSubject(subject);
        message.setContent(multipart);

        Transport.send(message);
    }
}
