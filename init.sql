CREATE DATABASE movinf OWNER postgres;
CREATE USER guest WITH PASSWORD '123';
\connect movinf;
CREATE SCHEMA "movinf-schema" AUTHORIZATION guest;
