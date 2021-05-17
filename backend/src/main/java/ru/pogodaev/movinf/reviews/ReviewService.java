package ru.pogodaev.movinf.reviews;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.pogodaev.movinf.films.Film;
import ru.pogodaev.movinf.films.FilmService;
import ru.pogodaev.movinf.users.UserService;
import ru.pogodaev.movinf.users.User;

@Service
public class ReviewService {
    private final ReviewRepository repository;

    @Autowired
    public ReviewService(ReviewRepository repository) {
        this.repository = repository;
    }

    public void addOrUpdateReview(Review review) {
        repository.save(review);
    }

    public void deleteReview(long userId, long filmId) {
        Film film = new Film();
        film.setId(filmId);
        User user = new User();
        user.setId(userId);
        repository.deleteById(new ReviewId(film, user));
    }

    public void deleteReview(Review review) {
        repository.delete(review);
    }

    public Iterable<Review> filmReviews(long filmId) {
        return repository.findByFilmId(filmId);
    }

    public Iterable<Review> userReviews(long userId) {
        return repository.findByUserId(userId);
    }

    public Iterable<Review> negativeFilmReviews(long filmId) {
        return repository.findNegativeByFilmId(filmId);
    }

    public Iterable<Review> positiveFilmReviews(long filmId) {
        return repository.findPositiveByFilmId(filmId);
    }

    public Iterable<Review> specificRatingFilmReviews(long filmId, int rating) {
        return repository.findRatingByFilmId(filmId, rating);
    }


}
