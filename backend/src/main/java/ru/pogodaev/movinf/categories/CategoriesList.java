package ru.pogodaev.movinf.categories;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonAppend;
import lombok.Data;

import java.util.Iterator;

@Data
public class CategoriesList {
    @JsonIgnoreProperties(value = {"films"})
    private final Iterable<Category> list;
}
