package ru.pogodaev.movinf.persons;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import ru.pogodaev.movinf.actors.Actor;
import ru.pogodaev.movinf.countries.Country;
import ru.pogodaev.movinf.films.Film;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Date;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(exclude = {"asActorFilms","asProducerFilms","asScenaristFilms","asDirectorFilms"})
@ToString(exclude = {"asActorFilms","asProducerFilms","asScenaristFilms","asDirectorFilms"})
@Table(name = "persons")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @NotNull(message = "Enter person's firstname")
    @Size(min = 1, max = 100, message = "Wrong person's firstname length, must be from 1 to 100 characters")
    @Column(name = "firstname")
    private String firstname;

    @Size(max = 100, message = "Wrong person's lastname length, must be up to 100 characters")
    @Column(name = "lastname")
    private String lastname;

    @Column(name = "birthdate")
    @JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING)
    private Date birthdate;

    @ManyToOne(targetEntity = Country.class)
    @JoinColumn(name = "country_id")
    @JsonIgnoreProperties(value = {"persons", "films"})
    private Country country;

    @JsonIgnoreProperties(value = {"person"})
    @OneToMany(mappedBy = "person")
    private List<Actor> asActorFilms;

    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios"})
    @ManyToMany(mappedBy = "scenarists")
    private List<Film> asScenaristFilms;

    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios"})
    @ManyToMany(mappedBy = "directors")
    private List<Film> asDirectorFilms;

    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios"})
    @ManyToMany(mappedBy = "producers")
    private List<Film> asProducerFilms;

    public void setFromAnother(Person person) {
        this.id = person.id;
        this.firstname = person. firstname;
        this.lastname = person.lastname;
        this.birthdate = person.birthdate;
        this.country = person.country;
    }
}
