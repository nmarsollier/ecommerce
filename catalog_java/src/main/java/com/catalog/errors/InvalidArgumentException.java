package com.catalog.errors;

public class InvalidArgumentException extends Exception {
    private static final long serialVersionUID = 1L;
    public String path;
    public String message;

    public InvalidArgumentException(String path, String message) {
        this.path = path;
        this.message = message;
    }
}