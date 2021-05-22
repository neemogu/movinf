package ru.pogodaev.movinf.categories;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
public class CategoriesList {
    @JsonIgnoreProperties(value = {"films"})
    private final Iterable<Category> list;
}
