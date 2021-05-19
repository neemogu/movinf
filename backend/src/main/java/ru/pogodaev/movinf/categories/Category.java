package ru.pogodaev.movinf.categories;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import ru.pogodaev.movinf.films.Film;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(exclude = {"films"})
@ToString(exclude = {"films"})
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @NotNull(message = "Enter category name")
    @Size(min = 1, max = 20, message = "Category must be named up to 20 characters")
    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnoreProperties(value = {"reviews", "producers", "directors", "scenarists", "actors", "studios"})
    private List<Film> films;
}
