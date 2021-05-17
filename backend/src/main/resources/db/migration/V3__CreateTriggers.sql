CREATE OR REPLACE FUNCTION update_film_rating_on_insert() RETURNS TRIGGER LANGUAGE plpgsql AS $$
    BEGIN
        UPDATE movinf_schema.films
        SET rating = film_avg_rating.avg_rating
        FROM (
            SELECT AVG(rating) AS avg_rating FROM movinf_schema.reviews
            WHERE film_id = new.film_id
            ) AS film_avg_rating
        WHERE id = new.film_id;
        RETURN NULL;
    END;
$$;

CREATE OR REPLACE FUNCTION update_film_rating_on_delete() RETURNS TRIGGER LANGUAGE plpgsql AS $$
    BEGIN
        UPDATE movinf_schema.films
        SET rating = film_avg_rating.avg_rating
        FROM (
            SELECT AVG(rating) AS avg_rating FROM movinf_schema.reviews
            WHERE film_id = old.film_id
            ) AS film_avg_rating
        WHERE id = old.film_id;
        RETURN NULL;
    END;
$$;

CREATE TRIGGER film_rating_update_on_insert AFTER INSERT ON movinf_schema.reviews
    FOR EACH ROW EXECUTE PROCEDURE update_film_rating_on_insert();

CREATE TRIGGER film_rating_update_on_delete AFTER DELETE ON movinf_schema.reviews
    FOR EACH ROW EXECUTE PROCEDURE update_film_rating_on_delete()
