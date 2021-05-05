package ru.pogodaev.movinf.common;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "countries")
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @NotNull
    @Size(min = 1, max = 30, message = "Country doesn't have a name up to 30 symbols")
    @Column(name = "name")
    private String name;
}
