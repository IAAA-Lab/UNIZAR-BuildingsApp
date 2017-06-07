package com.uzapp.security.jwt.utils;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

/**
 * Stores request result (User details) from authentication manager (spring security)
 *
 * @author Alejandro
 */
public class AuthToken extends UsernamePasswordAuthenticationToken {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private String token;

	public AuthToken(String token) {
        super(null, null);
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }
}
