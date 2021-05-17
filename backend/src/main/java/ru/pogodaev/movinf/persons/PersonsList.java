package ru.pogodaev.movinf.persons;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
public class PersonsList {
    @JsonIgnoreProperties(value = {"asActorFilms", "asProducerFilms", "asScenaristFilms", "asDirectorFilms"})
    private final Iterable<Person> list;
}
