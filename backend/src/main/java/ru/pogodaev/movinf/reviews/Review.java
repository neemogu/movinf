package ru.pogodaev.movinf.entities;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "reviews")
public class Review {
    @EmbeddedId
    private ReviewId id;

    @Size(max = 4000, message = "Review must contain up to 4000 characters")
    @Column(name = "text")
    private String text;

    @NotNull
    @Column(name = "rating")
    private int rating;
}
