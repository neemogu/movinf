CREATE DATABASE movinf OWNER postgres;
CREATE USER guest WITH PASSWORD '123';
GRANT ALL PRIVILEGES ON movinf TO guest;
\connect movinf;
CREATE SCHEMA "movinf-schema";
