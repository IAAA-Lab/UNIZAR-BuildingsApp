package com.uzapp.security.jwt;

import java.util.Collection;
import java.util.LinkedList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.uzapp.bd.Users;
import com.uzapp.security.exception.JwtMalformedException;
import com.uzapp.security.jwt.utils.JwtInfo;
import com.uzapp.security.jwt.utils.JwtUtil;

public class TokenAuthenticationService {

    private String tokenPrefix = "Bearer";
    private String tokenHeader = "Authorization";

    /**
     * Adds the token in the header tokenheader of the response
     */
    public void addAuthentication(HttpServletResponse response, String username) {

        // We generate a token now.
    	JwtInfo tokenInfo = new JwtInfo((long) 1, username, "ADMIN");
    	String JWT = new JwtUtil().generateToken(tokenInfo);

        response.addHeader(tokenHeader, tokenPrefix + " " + JWT);
        response.addHeader("Access-Control-Expose-Headers", tokenHeader);
    }

    /**
     *
     * @return authenticated user from validated token included in the header
     * tokenHeader of the @param response
     */
    public Authentication getAuthentication(HttpServletRequest request) {
        String token = request.getHeader(tokenHeader);

        System.out.println("HELLO? - token:" + token);

        if (token != null) {

          // Splits the string to get rid of 'Bearer ' prefix
          if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
          }

        	// parse the token.
          System.out.println("Gonna parse this shit");
        	JwtInfo tokenInfo = new JwtUtil().parseToken(token);

          System.out.println("TokenInfo: " + tokenInfo);

        	if (tokenInfo != null) {

	        	String username = tokenInfo.getUsername();
	        	String role = tokenInfo.getRole();

	        	// // Checks if the user exists in the database
	          //   if (username != null) {
            //
	          //   	String dbUsername = Users.getUsername();
            //
            //     System.out.println("dbUsername: " + dbUsername);
            //
	          //   	if (username.equals(dbUsername)) {

        		System.out.println("Usuario: " + username + ", Rol: " + role);

        		// we managed to retrieve a user
        		AuthenticatedUser user = new AuthenticatedUser(username);

        		// adds roles to authenticated user
        		Collection<GrantedAuthority> authorities = new LinkedList<GrantedAuthority>();
        		String[] roles = role.split(",");
        		for (int i = 0; i < roles.length; i++) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + roles[i]));
				    }

        		user.setAuthenticated(role.contains("ADMIN"));
        		return user;
        	}
        }
      	else {

          System.out.println("PETADA AL PARSEAR");

      		// error while parsing token, not valid
      		throw new JwtMalformedException("Token not valid");
    	   }
         return null;
    }
}
