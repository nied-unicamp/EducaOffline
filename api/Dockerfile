FROM maven:3.8.1-openjdk-11


WORKDIR /api/


COPY . /api/


RUN mvn clean package


EXPOSE 8082


# Indicar o caminho do .jar
ENTRYPOINT [ "java", "-jar", "./target/core_back_end-1.0-SNAPSHOT.jar", "--spring.datasource.url=${SPRING_DATASOURCE_URL}", "--spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}", "--server.port=${SERVER_PORT}"]
