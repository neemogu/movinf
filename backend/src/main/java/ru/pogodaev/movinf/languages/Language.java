package ru.pogodaev.movinf.common;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "languages")
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @NotNull
    @Size(min = 1, max = 30, message = "Language name is empty or too long (up to 30 characters)")
    @Column(name = "name")
    private String name;
}
