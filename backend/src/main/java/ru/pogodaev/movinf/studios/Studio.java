package ru.pogodaev.movinf.entities;

import lombok.Data;

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
    private int id;
    @NotNull
    @Size(min = 1, max = 100, message = "Studio doesn't have a name or it is too long (up to 100 characters)")
    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "studios")
    private List<Film> films;
}
