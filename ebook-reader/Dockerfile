# =========================================================================
# Stage 1: Build source code with Maven and JDK 25
# =========================================================================
FROM maven:3.9.11-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# =========================================================================
# Stage 2: Create lightweight runtime environment with JRE 25
# Help save RAM (Render Free only provides 512MB RAM)
# =========================================================================
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app

# Copy file .jar build from Stage 1 to Stage 2
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
