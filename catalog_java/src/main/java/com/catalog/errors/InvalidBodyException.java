package com.catalog.errors;

public class InvalidBodyException extends Exception {
    private static final long serialVersionUID = 1L;
    public String error;

    public InvalidBodyException(String error) {
        this.error = error;
    }
}