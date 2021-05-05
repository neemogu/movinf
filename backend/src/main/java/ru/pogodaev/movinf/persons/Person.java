package ru.pogodaev.movinf.entities;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;
import java.sql.Date;
import java.util.List;

@Data
@Entity
@Table(name = "persons")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;
    @NotNull
    @Size(min = 1, max = 100, message = "Wrong person firstname length, must be from 1 to 100 characters")
    @Column(name = "firstname")
    private String firstname;

    @Size(max = 100, message = "Wrong person lastname length, must be up to 100 characters")
    @Column(name = "lastname")
    private String lastname;

    @Column(name = "birthdate")
    private Date birthdate;

    @ManyToOne(targetEntity = Country.class)
    @JoinColumn(name = "country_id")
    private Country country;

    @OneToMany(mappedBy = "person")
    private List<Actor> asActorFilms;

    @ManyToMany(targetEntity = Film.class)
    @JoinTable(
            name = "scenarists",
            joinColumns = @JoinColumn(name = "person_id"),
            inverseJoinColumns = @JoinColumn(name = "film_id")
    )
    private List<Film> asScenaristFilms;

    @ManyToMany(targetEntity = Film.class)
    @JoinTable(
            name = "directors",
            joinColumns = @JoinColumn(name = "person_id"),
            inverseJoinColumns = @JoinColumn(name = "film_id")
    )
    private List<Film> asDirectorFilms;

    @ManyToMany(targetEntity = Film.class)
    @JoinTable(
            name = "producers",
            joinColumns = @JoinColumn(name = "person_id"),
            inverseJoinColumns = @JoinColumn(name = "film_id")
    )
    private List<Film> asProducerFilms;
}
