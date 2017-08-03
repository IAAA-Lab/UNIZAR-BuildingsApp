package com.uzapp.security.jwt.utils;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {

   private static String secret;

   private long EXPIRATIONTIME = 1000 * 60 * 60 * 24 * 10; // 10 days

   @Value("${jwt.secret}")
   private void setSecret(String secret) {
   	 JwtUtil.secret = secret;
   }

	/**
     * Generates a JWT token containing username as subject,
     * 	userId and role as additional claims. These properties
     *  are taken from the specified User object.
     *  Tokens validity is infinite.
     *
     * @param u the user for which the token will be generated
     * @return the JWT token
     */
    public String generateToken(JwtInfo u) {
    	Claims claims = Jwts.claims().setSubject(u.getUsername());
        claims.put("userId", u.getId() + "");
        claims.put("role", u.getRole());

        return Jwts.builder()
        		.setClaims(claims)
        		.setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
        		.signWith(SignatureAlgorithm.HS512, secret)
        		.compact();
    }

    /**
     * Tries to parse specified String as a JWT token. If successful,
     * returns User object with username, id and role prefilled
     * (extracted from token). If unsuccessful (token is invalid or not
     *  containing all required user properties) returns null.
     *
     * @param token the JWT token to parse
     * @return the User object extracted from specified token or null if a token is invalid.
     */
    public JwtInfo parseToken(String token) throws JwtException{
        JwtInfo u = null;

        // try{
        	Claims body = Jwts.parser()
        			.setSigningKey(secret)
        			.parseClaimsJws(token)
        			.getBody();

        	u = new JwtInfo();
            u.setUsername(body.getSubject());
            u.setId(Long.parseLong((String) body.get("userId")));
            u.setRole((String) body.get("role"));
            u.setExpirationDate((Date) body.getExpiration());
        // } catch (JwtException e) {
        //     e.printStackTrace();
        // }
        return u;
    }
}
