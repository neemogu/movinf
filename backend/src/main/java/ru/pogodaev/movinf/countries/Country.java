package ru.pogodaev.movinf.countries;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import ru.pogodaev.movinf.films.Film;
import ru.pogodaev.movinf.persons.Person;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(exclude = {"films", "persons"})
@ToString(exclude = {"films", "persons"})
@Table(name = "countries")
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @NotNull(message = "Enter country name")
    @Size(min = 1, max = 30, message = "Country doesn't have a name up to 30 symbols")
    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "countries", cascade = {CascadeType.REMOVE})
    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios"})
    private List<Film> films;

    @OneToMany(mappedBy = "country")
    @JsonIgnoreProperties(value = {"asActorFilms", "asProducerFilms", "asScenaristFilms", "asDirectorFilms"})
    private List<Person> persons;
}
