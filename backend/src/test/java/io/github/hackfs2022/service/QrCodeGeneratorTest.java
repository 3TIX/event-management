package io.github.hackfs2022.service;

import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

class QrCodeGeneratorTest {

    private final QrCodeGenerator qrCodeGenerator = new QrCodeGenerator();

    @Test
    void should_generate_qr_code() throws IOException {
        // given
        final var data = "6d841f51-28c4-45f2-baad-1152b1815771:secretCode";

        // when
        final var qrCode = qrCodeGenerator.generate(data);

        // then
        final var qrCodeStream = QrCodeGenerator.class.getResourceAsStream("/qrcode/test.png");
        assertThat(qrCodeStream).isNotNull();

        assertThat(qrCode).isEqualTo(qrCodeStream.readAllBytes());
    }
}