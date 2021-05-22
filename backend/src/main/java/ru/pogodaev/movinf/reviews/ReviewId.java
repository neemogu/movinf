package ru.pogodaev.movinf.reviews;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import ru.pogodaev.movinf.films.Film;
import ru.pogodaev.movinf.users.User;

import javax.persistence.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class ReviewId implements Serializable {
    @ManyToOne(targetEntity = Film.class)
    @JoinColumn(name = "film_id")
    private Film film;

    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "user_id")
    private User user;
}