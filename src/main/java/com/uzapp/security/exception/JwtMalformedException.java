package com.uzapp.security.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Thrown when token cannot be parsed
 */
public class JwtMalformedException extends AuthenticationException {


    public JwtMalformedException(String msg) {
        super(msg);
    }
}
