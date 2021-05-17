package ru.pogodaev.movinf.languages;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import ru.pogodaev.movinf.categories.Category;

@Data
public class LanguagesList {
    @JsonIgnoreProperties(value = {"films"})
    private final Iterable<Language> list;
}
