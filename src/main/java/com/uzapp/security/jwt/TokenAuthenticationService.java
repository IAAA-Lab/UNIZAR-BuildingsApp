package com.uzapp.security.jwt;

import java.util.Collection;
import java.util.LinkedList;

import java.io.IOException;
import java.lang.Exception;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.jsonwebtoken.JwtException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.uzapp.bd.Users;
import com.uzapp.security.exception.JwtMissingException;
import com.uzapp.security.jwt.utils.JwtInfo;
import com.uzapp.security.jwt.utils.JwtUtil;

public class TokenAuthenticationService {

    private String tokenPrefix = "Bearer";
    private String tokenHeader = "Authorization";

    /**
     * Adds the token in the header tokenheader of the response
     */
    public void addAuthentication(HttpServletResponse response, String username)
      throws IOException {

      try {

        // Obtains role from database based on provided username
        String role = Users.getRole(username);
        System.out.println("(addAuthentication) ROL DEL USUARIO (" + username + "): " + role);

        // We generate a token now.
        JwtInfo tokenInfo = new JwtInfo((long) 1, username, role);
        String JWT = new JwtUtil().generateToken(tokenInfo);

        response.addHeader(tokenHeader, tokenPrefix + " " + JWT);
        response.addHeader("Access-Control-Expose-Headers", tokenHeader);
      }
      catch (Exception e) {
        // response.sendError(401,"Credenciales incorrectas");
      }
    }

    /**
     *
     * @return authenticated user from validated token included in the header
     * tokenHeader of the @param response
     */
    public Authentication getAuthentication(HttpServletRequest request)
      throws JwtException {
        String token = request.getHeader(tokenHeader);

        if (token != null) {

          // Splits the string to get rid of 'Bearer ' prefix
          if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
          }

        	// parse the token.
        	JwtInfo tokenInfo = new JwtUtil().parseToken(token);
        	if (tokenInfo != null) {

	        	String username = tokenInfo.getUsername();
	        	String role = tokenInfo.getRole();

            System.out.println("(getAuthentication) ROL DEL USUARIO: " + role);

        		// adds roles to authenticated user
        		Collection<GrantedAuthority> authorities = new LinkedList<GrantedAuthority>();

            if (role.contains(",")) {

              // El usuario tiene mas de un rol
              String[] roles = role.split(",");
              for (int i = 0; i < roles.length; i++) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + roles[i]));
              }
            }
            else {

              // Solo tiene un rol
              authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
            }

            // we managed to retrieve a user
        		AuthenticatedUser user = new AuthenticatedUser(username);
            user.setAuthorities(authorities);

        		user.setAuthenticated(role.contains("ADMIN") || role.contains("USER"));
        		return user;
        	}
        }
      	else {

      		// error while parsing token, not valid
      		throw new JwtMissingException("Token not found");
    	   }
         return null;
    }
}
