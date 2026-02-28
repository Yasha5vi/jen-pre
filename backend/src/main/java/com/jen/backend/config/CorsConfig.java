package com.jen.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration for Spring Boot Backend
 * Configures CORS policies for the application
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(getAllowedOrigins())
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * Get allowed origins based on environment
     * Development: localhost on various ports
     * Production: specific AWS domain
     */
    private String[] getAllowedOrigins() {
        String environment = System.getProperty("environment", "development");

        if ("production".equalsIgnoreCase(environment)) {
            // Production: Allow your AWS domain
            // Update with your actual AWS domain
            return new String[]{
                "https://yourdomain.com",
                "https://www.yourdomain.com"
            };
        } else {
            // Development: Allow localhost on common ports
            return new String[]{
                "http://localhost:3000",      // React dev server
                "http://localhost:3001",      // Alternative port
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001"
            };
        }
    }
}

