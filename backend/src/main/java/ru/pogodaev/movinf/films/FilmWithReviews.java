package ru.pogodaev.movinf.films;

import lombok.AllArgsConstructor;
import lombok.Data;
import ru.pogodaev.movinf.reviews.Review;

import java.util.List;

@Data
@AllArgsConstructor
public class FilmWithReviews {
    private Film film;
    private List<Review> reviews;
    private Long reviewsCount;
}
