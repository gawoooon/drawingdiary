# Step 1: Build the application using Gradle
FROM gradle:7.6-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle clean build -x test

# 빌드 결과 확인 (추가)
RUN ls -l /app/build/libs

# Step 2: Run the application using JDK 17
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/drawingdiary-0.0.1-SNAPSHOT.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
