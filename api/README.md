# Core BackEnd

Importante!!

git config --global core.autocrlf true

## Prerequisites
 - MySQL 5.7+
 - Java 8 (JRE & JDK)
 - Maven 3.6+
 - Git

## Running

 ### Preparing the environment


 - Create a database named `test` (as in `src/main/resources/application.yml`>spring.datasource.url)

 - Note all properties in `application.yml` that should change for your environment. For example:
    * spring.datasource.username -> MySQL user
    * spring.datasource.password -> MySQL password
    * And others...

 ### Run

 - Enter the project folder:

    ~~~
     cd core/api
    ~~~
 - Build the `.jar` package:

    ~~~
     mvn clean package
     ~~~
   * This takes some time in the first run, because it is downloading all project dependencies
 - Run:

    ~~~
     java -jar target/core_back_end-1.0-SNAPSHOT.jar
    ~~~



  > For example, when you need to override a property, such as `spring.datasource.password`, do:
  >
  >
  >     java -jar target/core_back_end-1.0-SNAPSHOT.jar --spring.datasource.password='YOUR-MYSQL-PASSWORD'
  >
  >
  > Just an **example**, please add all properties that need to be changed from the current `application.yml` file.
  >
  > You can change those properties directly in the `application.yml` file in order to user the shorter run command, but note that you should **NEVER** commit those changes.


 - If everything is ok, you should see an message similar to: `br.niedunicamp.ApplicationStart: Started ApplicationStart in 20.025 seconds`

## Usage

  In the default configuration, the server should be at `localhost:8082`. For example, you can login making a POST request to http://localhost:8082/v1/login

  Please check `swagger` for all API endpoints details, such as: required request body, response body format, url parameters and others. It should be located at: http://localhost:8082/swagger-ui.html
