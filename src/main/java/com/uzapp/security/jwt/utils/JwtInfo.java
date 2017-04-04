package com.uzapp.security.jwt.utils;

import java.util.Date;

/**
 * Stores jwt info about the user
 *
 * @author Alejandro
 */
public class JwtInfo {

	private Long id;
    private String username;
    private String role;
    private Date expirationDate;

    public JwtInfo() {

    }

    public JwtInfo(Long id, String username, String role) {
		this.id = id;
		this.username = username;
		this.role = role;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

	public Date getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}
}
