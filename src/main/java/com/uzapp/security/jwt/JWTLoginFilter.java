package com.uzapp.security.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JWTLoginFilter extends AbstractAuthenticationProcessingFilter {

    private TokenAuthenticationService tokenAuthenticationService;

    public JWTLoginFilter(String url, AuthenticationManager authenticationManager) {
         super(new AntPathRequestMatcher(url));
         setAuthenticationManager(authenticationManager);
         tokenAuthenticationService = new TokenAuthenticationService();
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
    throws AuthenticationException, IOException, ServletException {

    	boolean isPreflight = httpServletRequest.getMethod().equals("OPTIONS");

    	if (isPreflight) {
    		return null;
    	}
    	else {

	    	// Checks current authentication
	    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	    	if (authentication == null) {

	    		System.out.println("Authentication == null");

	    		// there is no token, checks for credentials (user and password) in the body of the request
	    		long bodyLength = httpServletRequest.getContentLengthLong();
	    		String bodyContentType = httpServletRequest.getContentType();

	    		if (bodyLength > 0 && (bodyContentType != null && bodyContentType.equals("application/json"))) {
	    			try {

						AccountCredentials credentials = new ObjectMapper().readValue(httpServletRequest.getInputStream(), AccountCredentials.class);
						authentication = new UsernamePasswordAuthenticationToken(credentials.getUsername(), credentials.getPassword());

						// authenticates user through credentials
						authentication = getAuthenticationManager().authenticate(authentication);
	    			}
	    			catch(JsonParseException ex) {

	    				// BAD REQUEST
	    				httpServletResponse.sendError(400,"JSON PARSE FAIL");
	    			}
            catch(BadCredentialsException ex) {

              // BAD CREDENTIALS
	    				httpServletResponse.sendError(401,"Bad credentials");
            }
            catch(Exception e) {
              httpServletResponse.sendError(500);
            }
	    		}
	    		else {

	    			// BAD REQUEST
	    			httpServletResponse.sendError(400, "Info del body: " + bodyLength + " - " + bodyContentType);
	    		}
	    	}
	    	else {

          // authentication != null and contains the token sent from client,
	    		// keeps user authenticated with provided token
	    	}
	    	return authentication;
    	}
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication)
    throws IOException, ServletException {
        String name = authentication.getName();
        tokenAuthenticationService.addAuthentication(response, name);
    }
}
