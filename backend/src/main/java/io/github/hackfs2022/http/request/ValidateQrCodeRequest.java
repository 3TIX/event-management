package io.github.hackfs2022.http.request;

import java.util.UUID;

public record ValidateQrCodeRequest(UUID id, String validationCode) {

}
