package ru.pogodaev.movinf.actors;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import ru.pogodaev.movinf.persons.Person;
import ru.pogodaev.movinf.films.Film;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Data
@Entity
@EqualsAndHashCode(exclude = {"film", "person"})
@ToString(exclude = {"film", "person"})
@Table(name = "actors")
public class Actor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person_id")
    @JsonIgnoreProperties(value = {"asActorFilms", "asProducerFilms", "asScenaristFilms", "asDirectorFilms"})
    private Person person;

    @ManyToOne
    @JoinColumn(name = "film_id")
    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios"})
    private Film film;

    @Size(min = 1, max = 100, message = "Actor must contain a role from 1 to 100 characters length")
    @Column(name = "role")
    private String role;
}
