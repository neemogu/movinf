FROM openjdk:17
VOLUME /tmp
EXPOSE 8080
ADD target/movinf-backend-1.0.0.jar movinf-backend-1.0.0.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Dspring.profiles.active=container","-jar","/movinf-backend-1.0.0.jar"]