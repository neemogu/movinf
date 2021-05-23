package ru.pogodaev.movinf.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import ru.pogodaev.movinf.reviews.Review;

import java.util.List;

@Data
@AllArgsConstructor
public class UserWithReviews {
    private User user;
    private List<Review> reviews;
    private Long reviewsCount;
}
