package ru.pogodaev.movinf.films;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FilmListElement {
    @JsonIgnoreProperties(value = {"producers", "directors", "scenarists", "actors", "studios"})
    private Film film;
    private Long reviewsCount;
}
