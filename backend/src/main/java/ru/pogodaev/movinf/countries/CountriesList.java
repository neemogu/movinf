package ru.pogodaev.movinf.countries;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import ru.pogodaev.movinf.studios.Studio;

@Data
public class CountriesList {
    @JsonIgnoreProperties(value = {"films", "persons"})
    private final Iterable<Country> list;
}
