package io.github.hackfs2022.exception;

public class TicketNotValidException extends RuntimeException {

    public TicketNotValidException() {
        super("Ticket is not valid");
    }
}
