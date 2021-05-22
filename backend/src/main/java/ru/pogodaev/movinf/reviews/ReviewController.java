package ru.pogodaev.movinf.reviews;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.Optional;

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

    @GetMapping("/exist")
    public Boolean reviewExists(@RequestParam("userId") Long userId,
                                @RequestParam("filmId") Long filmId) {
        return service.exist(userId, filmId);
    }

    @GetMapping("/specific")
    public ResponseEntity<Review> specificReview(@RequestParam("userId") Long userId,
                                                 @RequestParam("filmId") Long filmId) {
        Review review = service.specificReview(userId, filmId);
        if (review == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(review, HttpStatus.OK);
        }
    }

    @GetMapping("/film/{filmId}")
    public Iterable<Review> filmReviews(@PathVariable Long filmId,
                                        @RequestParam(name = "pageNum", defaultValue = "0") Integer page,
                                        @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                                        @RequestParam(name = "sortBy", defaultValue = "title") String sortBy,
                                        @RequestParam(name = "sortDirection") Optional<String> sortDir,
                                        @RequestParam(name = "postDateFrom", defaultValue = "1870-01-01")
                                            @DateTimeFormat(pattern="yyyy-MM-dd") Date postDateFrom,
                                        @RequestParam(name = "postDateTo", defaultValue = "2100-01-01")
                                            @DateTimeFormat(pattern="yyyy-MM-dd") Date postDateTo,
                                        @RequestParam(name = "ratingFrom", defaultValue = "1") Integer ratingFrom,
                                        @RequestParam(name = "ratingTo", defaultValue = "10") Integer ratingTo) {
        return service.filmReviews(filmId, page, pageSize, sortBy, sortDir, ratingFrom, ratingTo, postDateFrom, postDateTo);
    }

    @GetMapping("/user/{userId}")
    public Iterable<Review> userReviews(@PathVariable Long userId,
                                        @RequestParam(name = "pageNum", defaultValue = "0") Integer page,
                                        @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                                        @RequestParam(name = "sortBy", defaultValue = "title") String sortBy,
                                        @RequestParam(name = "sortDirection") Optional<String> sortDir,
                                        @RequestParam(name = "postDateFrom", defaultValue = "1870-01-01")
                                            @DateTimeFormat(pattern="yyyy-MM-dd") Date postDateFrom,
                                        @RequestParam(name = "postDateTo", defaultValue = "2100-01-01")
                                            @DateTimeFormat(pattern="yyyy-MM-dd") Date postDateTo,
                                        @RequestParam(name = "ratingFrom", defaultValue = "1") Integer ratingFrom,
                                        @RequestParam(name = "ratingTo", defaultValue = "10") Integer ratingTo) {
        return service.userReviews(userId, page, pageSize, sortBy, sortDir, ratingFrom, ratingTo, postDateFrom, postDateTo);
    }



    @GetMapping("/user/{userId}/pages")
    public Long userReviewsPages(@PathVariable Long userId,
                                 @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                                 @RequestParam(name = "postDateFrom", defaultValue = "1870-01-01")
                                     @DateTimeFormat(pattern="yyyy-MM-dd") Date postDateFrom,
                                 @RequestParam(name = "postDateTo", defaultValue = "2100-01-01")
                                     @DateTimeFormat(pattern="yyyy-MM-dd") Date postDateTo,
                                 @RequestParam(name = "ratingFrom", defaultValue = "1") Integer ratingFrom,
                                 @RequestParam(name = "ratingTo", defaultValue = "10") Integer ratingTo) {
        return service.userReviewsPages(userId, pageSize, ratingFrom, ratingTo, postDateFrom, postDateTo);
    }

    @GetMapping("/film/{filmId}/pages")
    public Long filmReviewsPages(@PathVariable Long filmId,
                                 @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                                 @RequestParam(name = "postDateFrom", defaultValue = "1870-01-01")
                                     @DateTimeFormat(pattern="yyyy-MM-dd") Date postDateFrom,
                                 @RequestParam(name = "postDateTo", defaultValue = "2100-01-01")
                                     @DateTimeFormat(pattern="yyyy-MM-dd") Date postDateTo,
                                 @RequestParam(name = "ratingFrom", defaultValue = "1") Integer ratingFrom,
                                 @RequestParam(name = "ratingTo", defaultValue = "10") Integer ratingTo) {
        return service.filmReviewsPages(filmId, pageSize, ratingFrom, ratingTo, postDateFrom, postDateTo);
    }
}
