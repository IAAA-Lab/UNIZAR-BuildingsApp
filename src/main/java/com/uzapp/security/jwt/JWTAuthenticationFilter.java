package com.uzapp.security.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.ExpiredJwtException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import com.uzapp.security.exception.JwtMalformedException;

public class JWTAuthenticationFilter extends GenericFilterBean{

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {

    	// Checks if the token provided is valid
    	try {
        
        SecurityContextHolder.getContext().setAuthentication(null);

        if (((HttpServletRequest) request).getHeader("Authorization") != null) {
          Authentication authentication = new TokenAuthenticationService().getAuthentication((HttpServletRequest) request);
          System.out.println("Authentication: " + authentication);
          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    		filterChain.doFilter(request,response);
    	}
    	catch (MalformedJwtException ex) {
    		// filterChain.doFilter(request, response);
   		((HttpServletResponse) response).sendError(401, "Authentication Failed: Invalid token");
    	}
      catch (ExpiredJwtException ex) {

        // System.out.println("URL: " + request.url);
        String url = ((HttpServletRequest) request).getRequestURL().toString();
        System.out.println(url);

        if ( url.contains("login") ) {
          filterChain.doFilter(request, response);
        }
        else {
          ((HttpServletResponse) response).sendError(401, "Authentication Failed: Token expired");
        }
    	}
    }
}
