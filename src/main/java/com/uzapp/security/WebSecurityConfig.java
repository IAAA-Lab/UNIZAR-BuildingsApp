package com.uzapp.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.uzapp.security.jwt.JWTAuthenticationFilter;
import com.uzapp.security.jwt.JWTLoginFilter;

@Configuration
@ImportResource("classpath:spring-context.xml")
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	DataSource dataSource;

	@Autowired
	public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
		auth.jdbcAuthentication().dataSource(dataSource)
		// .passwordEncoder(passwordEncoder())
		.usersByUsernameQuery(
				"SELECT username, password, enabled FROM users WHERE username=?")
		.authoritiesByUsernameQuery(
				"SELECT username, role FROM users WHERE username=?");
	}

	@Override
	public void configure(WebSecurity web) throws Exception {

		// Ignores spring security filters
		web.ignoring()
			.antMatchers("/")
			.antMatchers(HttpMethod.OPTIONS, "/**")
			.antMatchers(HttpMethod.POST, "/checkToken")
			.antMatchers("/beans");
	}

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        // disable caching
        http.headers().cacheControl();

        http.csrf().disable() // disable csrf for our requests.
            .authorizeRequests()
//            .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
            // .antMatchers("/").permitAll()
            // .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            // .antMatchers(HttpMethod.POST, "/checkToken").permitAll()
            .antMatchers(HttpMethod.POST, "/login").permitAll()
            // .antMatchers("/beans").permitAll()
            .anyRequest().authenticated()
            .and()
//            .addFilterBefore(new CorsFilter(), UsernamePasswordAuthenticationFilter.class)
            // And filter other requests to check the presence of JWT in header
            .addFilterBefore(new JWTAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            // We filter the api/login requests
            .addFilterBefore(new JWTLoginFilter("/login", authenticationManager()), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public FilterRegistrationBean registerCorsFilter(CorsFilter filter) {
    	FilterRegistrationBean reg = new FilterRegistrationBean(filter);
    	reg.setOrder(4);
    	return reg;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
    	PasswordEncoder encoder = new BCryptPasswordEncoder();
    	return encoder;
    }
}
