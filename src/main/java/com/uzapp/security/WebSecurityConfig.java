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
import com.uzapp.bd.ConnectionManager;

@Configuration
@ImportResource("classpath:spring-context.xml")
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	// @Autowired
	// DataSource dataSource;
	DataSource myDataSource = ConnectionManager.datasource;

	@Autowired
	public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
		auth.jdbcAuthentication().dataSource(myDataSource)
		.passwordEncoder(passwordEncoder())
		.usersByUsernameQuery(
				"SELECT username, password, enabled FROM users WHERE username=?")
		.authoritiesByUsernameQuery(
				"SELECT username, role FROM users WHERE username=?");
	}

	@Override
	public void configure(WebSecurity web) throws Exception {

		// Ignores spring security filters
		web.ignoring()

			.antMatchers("/www/**")
			.antMatchers("/www/lib/**")

			.antMatchers("/")
			.antMatchers(HttpMethod.OPTIONS, "/**")
			.antMatchers(HttpMethod.POST, "/checkToken")

			// Photos
			.antMatchers(HttpMethod.GET, "/photos/approved/{\\w+}")
			.antMatchers(HttpMethod.POST, "/photos/upload")
			.antMatchers(HttpMethod.PUT, "/photos/")
			.antMatchers(HttpMethod.POST, "/photos/insert")

			// Pois
			.antMatchers(HttpMethod.GET, "/pois/{\\d+}")
			.antMatchers(HttpMethod.POST, "/pois/")
			.antMatchers(HttpMethod.PUT, "/pois/")
			.antMatchers("/pois/{\\w+}/{\\w+}/")
			.antMatchers("/pois/request")

			.antMatchers("/busquedas/**")
			.antMatchers("/estancias/**")

			.antMatchers("/users/login")

			.antMatchers(HttpMethod.POST, "/notificacion/incidencia")
			.antMatchers(HttpMethod.POST, "/notificacion/photo")
			.antMatchers(HttpMethod.GET, "/notificacion/imagen/{\\w+}")
			// .antMatchers("/notificacion/**")

			.antMatchers("/checkToken")
			.antMatchers("/checkAdmin")
			.antMatchers("/beans");
			// .antMatchers("/**");
	}

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        // disable caching
        http.headers().cacheControl();

        http.csrf().disable() // disable csrf for our requests.
            .authorizeRequests()
          //  .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
            // .antMatchers("/").permitAll()
            // .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            // .antMatchers(HttpMethod.POST, "/checkToken").permitAll()
            .antMatchers(HttpMethod.POST, "/login").permitAll()

						// Operaciones permitidas a usuario registrados

						// Operaciones permitidas a administradores
						.antMatchers("/database/**").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.GET, "/photos/").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.DELETE, "/photos/{\\d+}").access("hasRole('ROLE_ADMIN')")

						.antMatchers(HttpMethod.GET, "/pois/").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.GET, "/pois/request/pending").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.GET, "/pois/request/{\\d+}/{\\w+}/{\\w+}").access("hasRole('ROLE_ADMIN')")

						.antMatchers(HttpMethod.GET, "/users/info").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
						.antMatchers(HttpMethod.POST, "/users/create").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.PUT, "/users/edit").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.POST, "/mail").access("hasRole('ROLE_ADMIN')")

						.antMatchers(HttpMethod.GET, "/notificacion").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.DELETE, "/notificacion").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.GET, "/notificacion/cambio").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.POST, "/notificacion/cambio/{\\d+}").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
						.antMatchers(HttpMethod.PUT, "/notificacion/cambio/{\\d+}").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
						.antMatchers(HttpMethod.DELETE, "/notificacion/cambio/{\\d+}").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.GET, "/notificacion/incidencia").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.POST, "/notificacion/incidencia/{\\d+}").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
						.antMatchers(HttpMethod.PUT, "/notificacion/incidencia/{\\d+}").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.DELETE, "/notificacion/incidencia/{\\d+}").access("hasRole('ROLE_ADMIN')")
						.antMatchers(HttpMethod.GET, "/notificacion/cambio/user").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")


						.anyRequest().authenticated()
            .and()
          //  .addFilterBefore(new CorsFilter(), UsernamePasswordAuthenticationFilter.class)
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
