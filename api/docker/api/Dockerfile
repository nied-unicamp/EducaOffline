FROM openjdk:8-alpine
# COPY ./resources/core_back_end-1.0-SNAPSHOT.jar /usr/src/core-api/core-api.jar
RUN apk update && apk add bash

RUN mkdir -p /usr/src/core-api
ENV PROJECT_HOME /usr/src/core-api

COPY ./resources/ ${PROJECT_HOME}
WORKDIR ${PROJECT_HOME}

ENTRYPOINT ["java", "-jar", "./core_back_end-1.0-SNAPSHOT.jar", "--spring.datasource.url=${SPRING_DATASOURCE_URL}", "--spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}", "--server.port=${SERVER_PORT}"]