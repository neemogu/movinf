package ru.pogodaev.movinf.languages;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@EqualsAndHashCode(exclude = {"films"})
@ToString(exclude = {"films"})
@Table(name = "languages")
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @NotNull(message = "Enter language name")
    @Size(min = 1, max = 30, message = "Language name is empty or too long (up to 30 characters)")
    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "language")
    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios"})
    private List<Film> films;
}
