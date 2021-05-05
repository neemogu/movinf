package ru.pogodaev.movinf.entities;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @NotNull
    @Size(min = 1, max = 20, message = "Category must be named up to 20 characters")
    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "categories")
    private List<Film> films;
}
