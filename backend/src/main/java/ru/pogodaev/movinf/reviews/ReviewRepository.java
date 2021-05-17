package ru.pogodaev.movinf.reviews;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
    @Query(value = "SELECT * FROM movinf_schema.reviews WHERE film_id = ?1", nativeQuery = true)
    Iterable<Review> findByFilmId(long filmId);
    @Query(value = "SELECT * FROM movinf_schema.reviews WHERE user_id = ?1", nativeQuery = true)
    Iterable<Review> findByUserId(long userId);
    @Query(value = "SELECT * FROM movinf_schema.reviews WHERE film_id = ?1 AND rating <= 5", nativeQuery = true)
    Iterable<Review> findNegativeByFilmId(long filmId);
    @Query(value = "SELECT * FROM movinf_schema.reviews WHERE film_id = ?1 AND rating > 5", nativeQuery = true)
    Iterable<Review> findPositiveByFilmId(long filmId);
    @Query(value = "SELECT * FROM movinf_schema.reviews WHERE film_id = ?1 AND rating = ?2", nativeQuery = true)
    Iterable<Review> findRatingByFilmId(long filmId, int rating);
}
