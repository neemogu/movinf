package ru.pogodaev.movinf.films;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import ru.pogodaev.movinf.persons.Person;
import ru.pogodaev.movinf.films.Film;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "actors")
public class Actor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @ManyToOne
    @JoinColumn(name = "person_id")
    @JsonIgnoreProperties(value = {"asActorFilms", "asProducerFilms", "asScenaristFilms", "asDirectorFilms"})
    private Person person;

    @ManyToOne
    @JoinColumn(name = "film_id")
    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios", "countries",
            "categories"})
    private Film film;

    @Size(min = 1, max = 100, message = "Actor must contain a role up to 100 characters length")
    @Column(name = "role")
    private String role;
}
