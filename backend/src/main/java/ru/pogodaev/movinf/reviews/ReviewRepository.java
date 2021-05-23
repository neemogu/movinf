package ru.pogodaev.movinf.reviews;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
    @Query(value = "SELECT * FROM movinf_schema.reviews WHERE film_id = ?1 AND user_id = ?2", nativeQuery = true)
    Optional<Review> find(long filmId, long userId);
    @Query(value = "SELECT EXISTS (SELECT 1 FROM movinf_schema.reviews WHERE film_id = ?1 AND user_id = ?2)", nativeQuery = true)
    boolean exist(long filmId, long userId);

    @Query(value = "SELECT * FROM movinf_schema.reviews " +
            "JOIN movinf_schema.films f on f.id = reviews.film_id " +
            "WHERE f.id = ?1 " +
            "ORDER BY reviews.post_date DESC " +
            "LIMIT ?2", nativeQuery = true)
    List<Review> getFirstReviewsByFilm(long filmId, int count);

    @Query(value = "SELECT COUNT(*) FROM movinf_schema.reviews " +
            "JOIN movinf_schema.films f on f.id = reviews.film_id " +
            "WHERE f.id = ?1", nativeQuery = true)
    Long getReviewsCountByFilm(long filmId);

    @Query(value = "SELECT * FROM movinf_schema.reviews " +
            "JOIN movinf_schema.users u on u.id = reviews.user_id " +
            "WHERE u.id = ?1 " +
            "ORDER BY reviews.post_date DESC " +
            "LIMIT ?2", nativeQuery = true)
    List<Review> getFirstReviewsByUser(long userId, int count);

    @Query(value = "SELECT COUNT(*) FROM movinf_schema.reviews " +
            "JOIN movinf_schema.users u on u.id = reviews.user_id " +
            "WHERE u.id = ?1", nativeQuery = true)
    Long getReviewsCountByUser(long userId);
}
