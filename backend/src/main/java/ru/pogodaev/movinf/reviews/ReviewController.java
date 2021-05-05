package ru.pogodaev.movinf.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.entities.Review;
import ru.pogodaev.movinf.repositories.FilmRepository;
import ru.pogodaev.movinf.repositories.ReviewRepository;
import ru.pogodaev.movinf.repositories.UserProfileRepository;

import javax.validation.Valid;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewRepository repository;

    @Autowired
    public ReviewController(ReviewRepository repository) {
        this.repository = repository;
    }

    @PostMapping(path = "/new", consumes = "application/json")
    public ResponseEntity<String> addReview(@RequestBody @Valid Review review) {
        repository.save(review);
        return ResponseEntity.ok("Review was successfully added");
    }

    @GetMapping("/film/{filmId}")
    public Iterable<Review> filmReviews(@PathVariable Long filmId) {
        return repository.findByFilmId(filmId);
    }

    @GetMapping("/user/{userId}")
    public Iterable<Review> userReviews(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    @GetMapping("/film/{filmId}/negative")
    public Iterable<Review> negativeFilmReviews(@PathVariable Long filmId) {
        return repository.findNegativeByFilmId(filmId);
    }

    @GetMapping("/film/{filmId}/positive")
    public Iterable<Review> positiveFilmReviews(@PathVariable Long filmId) {
        return repository.findPositiveByFilmId(filmId);
    }

    @GetMapping("/film/{filmId}/{rating}")
    public Iterable<Review> specificRatingFilmReviews(@PathVariable Long filmId,
                                                      @PathVariable Integer rating) {
        return repository.findRatingByFilmId(filmId, rating);
    }
}
