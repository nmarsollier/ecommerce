package com.catalog.errors;

import java.util.ArrayList;
import java.util.List;

public class MultipleArgumentsException extends Exception {
    private static final long serialVersionUID = 1L;
    List<InvalidArgumentException> errors = new ArrayList<>();

    public MultipleArgumentsException() {

    }

    public void addError(InvalidArgumentException error) {
        errors.add(error);
    }

    /**
     * @return the errors
     */
    public List<InvalidArgumentException> getErrors() {
        return errors;
    }
}