package ru.pogodaev.movinf.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.net.UnknownServiceException;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class ReviewId implements Serializable {
    @ManyToOne(targetEntity = Film.class)
    @JoinColumn(name = "film_id")
    private Film film;

    @ManyToOne(targetEntity = UserProfile.class)
    @JoinColumn(name = "user_id")
    private UserProfile user;
}
