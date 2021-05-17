package ru.pogodaev.movinf.reviews;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.reviews.Review;
import ru.pogodaev.movinf.reviews.ReviewRepository;

import javax.validation.Valid;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewService service;

    @Autowired
    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<String> addReview(@RequestBody @Valid Review review) {
        service.addOrUpdateReview(review);
        return ResponseEntity.ok("Review was successfully added");
    }

    @PutMapping(consumes = "application/json")
    public ResponseEntity<String> updateReview(@RequestBody @Valid Review review) {
        service.addOrUpdateReview(review);
        return ResponseEntity.ok("Review was successfully updated");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteReview(@RequestParam("userId") Long userId,
                                               @RequestParam("filmId") Long filmId) {
        service.deleteReview(userId, filmId);
        return new ResponseEntity<>("Review was deleted", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/film/{filmId}")
    public Iterable<Review> filmReviews(@PathVariable Long filmId) {
        return service.filmReviews(filmId);
    }

    @GetMapping("/user/{userId}")
    public Iterable<Review> userReviews(@PathVariable Long userId) {
        return service.userReviews(userId);
    }

    @GetMapping("/film/{filmId}/negative")
    public Iterable<Review> negativeFilmReviews(@PathVariable Long filmId) {
        return service.negativeFilmReviews(filmId);
    }

    @GetMapping("/film/{filmId}/positive")
    public Iterable<Review> positiveFilmReviews(@PathVariable Long filmId) {
        return service.positiveFilmReviews(filmId);
    }

    @GetMapping("/film/{filmId}/rating/{rating}")
    public Iterable<Review> specificRatingFilmReviews(@PathVariable Long filmId,
                                                      @PathVariable Integer rating) {
        return service.specificRatingFilmReviews(filmId, rating);
    }
}
