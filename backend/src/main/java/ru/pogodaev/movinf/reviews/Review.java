package ru.pogodaev.movinf.reviews;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import ru.pogodaev.movinf.films.Film;
import ru.pogodaev.movinf.users.User;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
@Entity
@Table(name = "reviews")
public class Review {
    @EmbeddedId
    @JsonIgnore
    private ReviewId id = new ReviewId();

    @JsonProperty("film")
    @JsonIgnoreProperties(value = {"reviews", "producers", "directors",
            "scenarists", "actors", "studios", "countries", "categories", "reviewsCount"})
    public Film getFilm() {
        return id.getFilm();
    }

    @JsonProperty("user")
    @JsonIgnoreProperties(value = {"reviews", "reviewsCount"})
    public User getUser() {
        return id.getUser();
    }


    @JsonProperty("film")
    public void setFilm(Film film) {
        id.setFilm(film);
    }

    @JsonProperty("user")
    public void setUser(User user) {
        id.setUser(user);
    }

    @Size(max = 1000, message = "Review must contain up to 1000 characters")
    @Column(name = "text")
    private String text;

    @NotNull(message = "Enter rating")
    @Column(name = "rating")
    @Min(value = 1, message = "Rating must be between 1 and 10")
    @Max(value = 10, message = "Rating must be between 1 and 10")
    private Integer rating;

    @Column(name = "post_date")
    @JsonFormat(pattern = "dd.MM.yyyy")
    private Date postDate;

    @PrePersist
    public void postDate() {
        postDate = new Date();
    }
}
