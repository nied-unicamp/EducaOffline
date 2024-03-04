package br.niedunicamp.config;

//#region Imports
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
//#endregion

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {


    //  Note that not all requests starting with /v1/register/
    // can be open to users that are not authenticated
    private final String[] registrationURLs = {
            "/v1/register/start",
            "/v1/register/finish",
            "/v1/register/forgotPassword",
            "/v1/register/redefinePassword"
    };

    // Swagger urls that should not require authentication
    private final String[] swaggerURLs = {
            "/v2/api-docs",
            "/configuration/**",
            "/swagger-resources/**",
            "/swagger-ui.html",
            "/webjars/**",
            "/api-docs/**"
    };


    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.headers().frameOptions().disable().and()
                .authorizeRequests()

                // Allow not authenticated access to all OPTIONS requests
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Allow not authenticated access to registration URLs
                .antMatchers(registrationURLs).permitAll()

                // Allow Login =D
                .antMatchers("/v1/login").permitAll()

                // Allow swagger access without authentication
                .antMatchers(swaggerURLs).permitAll()

                .antMatchers("/v1/connection").permitAll()

                // Every other request requires the user to be authenticated
                .anyRequest().authenticated();
    }
}
