package br.niedunicamp.exception;

public class FileStorageException extends RuntimeException {
    private static final long serialVersionUID = 6182200090204890884L;

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}