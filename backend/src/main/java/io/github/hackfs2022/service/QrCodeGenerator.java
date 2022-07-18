package io.github.hackfs2022.service;

import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static com.google.zxing.BarcodeFormat.QR_CODE;

public class QrCodeGenerator {

    public byte[] generate(String data) {
        try {
            final var qrCodeWriter = new QRCodeWriter();
            final var bitMatrix = qrCodeWriter.encode(data, QR_CODE, 512, 512);
            final var outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "png", outputStream);

            return outputStream.toByteArray();
        } catch (IOException | WriterException e) {
            throw new RuntimeException(e);
        }
    }
}
