package ru.pogodaev.movinf.studios;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import ru.pogodaev.movinf.films.Film;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Entity
@Table(name = "studios")
public class Studio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @NotNull(message = "Enter studio name")
    @Size(min = 1, max = 100, message = "Studio doesn't have a name or it is too long (up to 100 characters)")
    @Column(name = "name")
    private String name;

    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios"})
    @ManyToMany(mappedBy = "studios", cascade = CascadeType.REMOVE)
    private List<Film> films;
}
