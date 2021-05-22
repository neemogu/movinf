package ru.pogodaev.movinf.studios;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
public class StudiosList {
    @JsonIgnoreProperties(value = {"films"})
    private final Iterable<Studio> list;
}
