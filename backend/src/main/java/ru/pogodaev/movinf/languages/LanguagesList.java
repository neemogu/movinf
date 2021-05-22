package ru.pogodaev.movinf.languages;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
public class LanguagesList {
    @JsonIgnoreProperties(value = {"films"})
    private final Iterable<Language> list;
}
