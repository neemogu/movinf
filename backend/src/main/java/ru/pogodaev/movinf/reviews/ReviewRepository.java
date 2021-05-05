package ru.pogodaev.movinf.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.scheduling.config.IntervalTask;
import ru.pogodaev.movinf.entities.Review;

import java.awt.event.ItemEvent;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query(value = "SELECT * FROM reviews WHERE film_id = ?1", nativeQuery = true)
    Iterable<Review> findByFilmId(long filmId);
    @Query(value = "SELECT * FROM reviews WHERE user_id = ?1", nativeQuery = true)
    Iterable<Review> findByUserId(long userId);
    @Query(value = "SELECT * FROM reviews WHERE film_id = ?1 AND rating <= 5", nativeQuery = true)
    Iterable<Review> findNegativeByFilmId(long filmId);
    @Query(value = "SELECT * FROM reviews WHERE film_id = ?1 AND rating > 5", nativeQuery = true)
    Iterable<Review> findPositiveByFilmId(long filmId);
    @Query(value = "SELECT * FROM reviews WHERE film_id = ?1 AND rating = ?2", nativeQuery = true)
    Iterable<Review> findRatingByFilmId(long filmId, int rating);
}
