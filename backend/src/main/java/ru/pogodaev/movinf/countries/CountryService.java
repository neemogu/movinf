package ru.pogodaev.movinf.common;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CountryService {
    private final CountryRepository repository;

    public CountryService(CountryRepository repository) {
        this.repository = repository;
    }

    public Country getSpecificCountry(int id) {
        Optional<Country> found = repository.findById(id);
        return found.orElse(null);
    }
}
