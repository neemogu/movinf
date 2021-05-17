CREATE TABLE IF NOT EXISTS languages (
    id serial PRIMARY KEY,
    name varchar(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS countries (
    id serial PRIMARY KEY,
    name varchar(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categories (
    id serial PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS studios (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id bigserial PRIMARY KEY,
    username varchar(20) NOT NULL UNIQUE,
    password varchar(256) NOT NULL,
    firstname varchar(20),
    lastname varchar(30),
    birthdate date CHECK ( birthdate > '1900-01-01'),
    gender int,
    email varchar(100) NOT NULL UNIQUE,
    registration_date date NOT NULL,
    role varchar(5) NOT NULL
);

CREATE TABLE IF NOT EXISTS films (
    id bigserial PRIMARY KEY,
    title varchar(200) NOT NULL,
    short_description varchar(500),
    full_description varchar(3000),
    production_date date,
    tagline varchar(200),
    language_id int REFERENCES languages(id),
    budget bigint CHECK (budget > 0),
    box_office bigint CHECK (box_office > 0),
    duration int NOT NULL CHECK (duration > 0),
    age_rating int NOT NULL,
    rating real CHECK (rating IS NULL OR (rating >= 1 AND rating <= 10))
);

CREATE TABLE IF NOT EXISTS reviews (
    film_id bigint,
    user_id bigint,
    text varchar(4000),
    rating int NOT NULL CHECK ( rating >= 1 AND rating <= 10 ),
    post_date date NOT NULL,
    CONSTRAINT review_pk PRIMARY KEY(film_id, user_id),
    CONSTRAINT review_film_fk FOREIGN KEY(film_id) REFERENCES films(id),
    CONSTRAINT review_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS persons (
    id bigserial PRIMARY KEY,
    firstname varchar(30) NOT NULL,
    lastname varchar(50),
    birthdate date CHECK ( birthdate > '1900-01-01' ),
    country_id int REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS film_country (
    film_id bigint,
    country_id int,
    CONSTRAINT film_country_pk PRIMARY KEY(film_id, country_id),
    CONSTRAINT film_country_to_film_fk FOREIGN KEY(film_id) REFERENCES films(id),
    CONSTRAINT film_country_to_country_fk FOREIGN KEY(country_id) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS film_studio (
    film_id bigint,
    studio_id int,
    CONSTRAINT film_studio_pk PRIMARY KEY(film_id, studio_id),
    CONSTRAINT film_studio_to_film_fk FOREIGN KEY(film_id) REFERENCES films(id),
    CONSTRAINT film_studio_to_studio_fk FOREIGN KEY(studio_id) REFERENCES studios(id)
);

CREATE TABLE IF NOT EXISTS film_category (
    film_id bigint,
    category_id int,
    CONSTRAINT film_category_pk PRIMARY KEY(film_id, category_id),
    CONSTRAINT film_category_to_film_fk FOREIGN KEY(film_id) REFERENCES films(id),
    CONSTRAINT film_category_to_category_fk FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS scenarists (
    film_id bigint,
    person_id int,
    CONSTRAINT scenarists_pk PRIMARY KEY(film_id, person_id),
    CONSTRAINT scenarists_to_film_fk FOREIGN KEY(film_id) REFERENCES films(id),
    CONSTRAINT scenarists_to_person_fk FOREIGN KEY(person_id) REFERENCES persons(id)
);

CREATE TABLE IF NOT EXISTS producers (
    film_id bigint,
    person_id int,
    CONSTRAINT producers_pk PRIMARY KEY(film_id, person_id),
    CONSTRAINT producers_to_film_fk FOREIGN KEY(film_id) REFERENCES films(id),
    CONSTRAINT producers_to_person_fk FOREIGN KEY(person_id) REFERENCES persons(id)
);

CREATE TABLE IF NOT EXISTS directors (
    film_id bigint,
    person_id int,
    CONSTRAINT directors_pk PRIMARY KEY(film_id, person_id),
    CONSTRAINT directors_to_film_fk FOREIGN KEY(film_id) REFERENCES films(id),
    CONSTRAINT directors_to_person_fk FOREIGN KEY(person_id) REFERENCES persons(id)
);

CREATE TABLE IF NOT EXISTS actors (
    id bigserial PRIMARY KEY,
    film_id bigint REFERENCES films(id) NOT NULL,
    person_id int REFERENCES persons(id) NOT NULL,
    role varchar(50) NOT NULL
);
