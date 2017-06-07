package com.uzapp.security.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Thrown when token cannot be found in the request header
 */

public class JwtMissingException extends AuthenticationException {


    public JwtMissingException(String msg) {
        super(msg);
    }
}
