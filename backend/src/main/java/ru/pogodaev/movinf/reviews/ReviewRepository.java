package ru.pogodaev.movinf.reviews;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
    @Query(value = "SELECT * FROM movinf_schema.reviews WHERE film_id = ?1 AND user_id = ?2", nativeQuery = true)
    Optional<Review> find(long filmId, long userId);
    @Query(value = "SELECT EXISTS (SELECT 1 FROM movinf_schema.reviews WHERE film_id = ?1 AND user_id = ?2)", nativeQuery = true)
    boolean exist(long filmId, long userId);
}
