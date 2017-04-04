package com.uzapp.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uzapp.security.jwt.utils.JwtInfo;
import com.uzapp.security.jwt.utils.JwtUtil;

@CrossOrigin(origins = "*")
@RestController
public class TokenController {

    @RequestMapping("/")
    public void checkApi(HttpServletResponse response) {
      response.setStatus(200);
    }

    @RequestMapping("/checkToken")
    public void checkToken(
    		@RequestHeader(value="Authorization", defaultValue="") String token,
    		HttpServletResponse response) {

    	JwtUtil jwt = new JwtUtil();
    	if (token.length() == 0) {

    		// There is no token
    		response.setStatus(400);
    	}
    	else {

        // Splits the string to get rid of 'Bearer ' prefix
        if (token.startsWith("Bearer ")) {
          token = token.split(" ")[1];
        }

        System.out.println("TOKEN: " + token);

    		JwtInfo jwtInfo = jwt.parseToken(token);
    		if (jwtInfo == null) {

    			// Invalid token
    			response.setStatus(401);
    		}
    		else {

    			// Valid token
    			response.setStatus(200);
    		}

    	}
    }
}
