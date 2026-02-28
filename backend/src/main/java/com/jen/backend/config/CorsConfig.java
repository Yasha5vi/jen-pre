package com.jen.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration for Spring Boot Backend
 * Configures CORS policies based on environment
 * - Development: localhost ports
 * - Docker/Container: service names
 * - Production: domain names via reverse proxy/load balancer
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }

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
     *
     * Development (local): localhost on various ports
     * Docker (Jenkins CI/CD): frontend service name (http://frontend:3000)
     * Production (AWS): domain name or reverse proxy (https://yourdomain.com)
     */
    private String[] getAllowedOrigins() {
        String environment = System.getenv("ENVIRONMENT");
        if (environment == null) {
            environment = System.getProperty("environment", "development");
        }

        if ("production".equalsIgnoreCase(environment)) {
            // Production: AWS domain or reverse proxy
            // Frontend accesses backend through reverse proxy (nginx/ALB)
            return new String[]{
                    "http://13.201.16.100:30008",
                    "http://13.201.16.100"
            };
        } else if ("docker".equalsIgnoreCase(environment) || "container".equalsIgnoreCase(environment)) {
            // Docker/Container (Jenkins, Docker Compose): Use service names
            // Services communicate via internal Docker network using service names
            return new String[]{
                "http://frontend:3000",      // Frontend service name
                "http://frontend:3001",      // Alternative port
                "http://localhost:3000",     // Local fallback
                "http://localhost:3001"
            };
        } else {
            // Development: localhost on common ports
            return new String[]{
                "http://localhost:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001"
            };
        }
    }
}



