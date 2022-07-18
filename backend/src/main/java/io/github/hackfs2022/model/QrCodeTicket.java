package io.github.hackfs2022.model;

import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static io.github.hackfs2022.model.QrCodeTicket.Builder.qrCodeTicket;
import static io.github.hackfs2022.model.QrCodeTicket.Status.NFT_BURNED;
import static java.time.Clock.systemUTC;
import static java.time.Instant.now;
import static java.util.Optional.empty;
import static java.util.UUID.randomUUID;

public class QrCodeTicket {

    public final UUID id;
    public final Instant createdDate;
    public final Instant updatedDate;
    public final String email;
    public final Status status;
    public final String validationCode;
    public final Optional<String> contractAddress;
    public final Optional<Integer> tokenId;
    public final Optional<Integer> blockNumber;
    public final Optional<Instant> verificationDate;

    private QrCodeTicket(Builder builder) {
        this.id = builder.id;
        this.createdDate = builder.createdDate;
        this.updatedDate = builder.updatedDate != null ? builder.updatedDate : builder.createdDate;
        this.email = builder.email;
        this.status = builder.status;
        this.validationCode = builder.validationCode;
        this.contractAddress = builder.contractAddress;
        this.tokenId = builder.tokenId;
        this.blockNumber = builder.blockNumber;
        this.verificationDate = builder.verificationDate;
    }

    public enum Status {
        CREATED,
        NFT_BURNED,
        QR_CODE_SENT,
        QR_CODE_VALIDATED
    }

    private QrCodeTicket.Builder copy() {
        return qrCodeTicket()
            .id(id)
            .createdDate(createdDate)
            .updatedDate(updatedDate)
            .email(email)
            .status(status)
            .validationCode(validationCode)
            .contractAddress(contractAddress)
            .tokenId(tokenId)
            .blockNumber(blockNumber)
            .verificationDate(verificationDate);
    }

    public QrCodeTicket nftBurned(String contractAddress, Integer tokenId, Integer blockNumber) {
        return copy()
            .status(NFT_BURNED)
            .contractAddress(Optional.of(contractAddress))
            .tokenId(Optional.of(tokenId))
            .blockNumber(Optional.of(blockNumber))
            .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        final QrCodeTicket that = (QrCodeTicket) o;
        return Objects.equals(id, that.id) &&
            Objects.equals(createdDate, that.createdDate) &&
            Objects.equals(updatedDate, that.updatedDate) &&
            Objects.equals(email, that.email) &&
            status == that.status &&
            Objects.equals(validationCode, that.validationCode) &&
            Objects.equals(contractAddress, that.contractAddress) &&
            Objects.equals(tokenId, that.tokenId) &&
            Objects.equals(blockNumber, that.blockNumber) &&
            Objects.equals(verificationDate, that.verificationDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, createdDate, updatedDate, email, status, validationCode, contractAddress,
            tokenId, blockNumber, verificationDate);
    }

    public static final class Builder {

        private UUID id;
        private Instant createdDate = now(systemUTC());
        private Instant updatedDate;
        private String email;
        private Status status;
        private String validationCode;
        private Optional<String> contractAddress = empty();
        private Optional<Integer> tokenId = empty();
        private Optional<Integer> blockNumber = empty();
        private Optional<Instant> verificationDate = empty();

        private Builder() {
        }

        public static Builder qrCodeTicket() {
            return new Builder().id(randomUUID());
        }

        public Builder id(UUID id) {
            this.id = id;
            return this;
        }

        public Builder createdDate(Instant createdDate) {
            this.createdDate = createdDate;
            return this;
        }

        public Builder updatedDate(Instant updatedDate) {
            this.updatedDate = updatedDate;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder status(Status status) {
            this.status = status;
            return this;
        }

        public Builder validationCode(String validationCode) {
            this.validationCode = validationCode;
            return this;
        }

        public Builder contractAddress(Optional<String> contractAddress) {
            this.contractAddress = contractAddress;
            return this;
        }

        public Builder tokenId(Optional<Integer> tokenId) {
            this.tokenId = tokenId;
            return this;
        }

        public Builder blockNumber(Optional<Integer> blockNumber) {
            this.blockNumber = blockNumber;
            return this;
        }

        public Builder verificationDate(Optional<Instant> verificationDate) {
            this.verificationDate = verificationDate;
            return this;
        }

        public QrCodeTicket build() {
            return new QrCodeTicket(this);
        }
    }
}
