package io.github.hackfs2022.http.response;

import java.time.Instant;

public record ValidateQrCodeResponse(boolean previouslyValidated, Instant validationTime) {

}
