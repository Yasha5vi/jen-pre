# Backend Dockerfile
# Spring Boot Application

FROM maven:3.8.1-openjdk-17 AS builder

WORKDIR /app

# Copy pom.xml
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy built JAR from builder
COPY --from=builder /app/target/backend-*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment for Docker
ENV ENVIRONMENT=docker
ENV SPRING_PROFILES_ACTIVE=docker

# Start application
CMD ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]

