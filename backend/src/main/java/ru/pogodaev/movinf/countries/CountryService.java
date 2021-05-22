package ru.pogodaev.movinf.countries;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.pogodaev.movinf.persons.Person;
import ru.pogodaev.movinf.persons.PersonsService;

import java.util.List;
import java.util.Optional;

@Service
public class CountryService {
    private final CountryRepository repository;
    private final PersonsService personsService;

    @Autowired
    public CountryService(CountryRepository repository, PersonsService personsService) {
        this.repository = repository;
        this.personsService = personsService;
    }

    public Country getSpecificCountry(int id) {
        Optional<Country> found = repository.findById(id);
        return found.orElse(null);
    }

    public List<Country> getList() {
        return repository.findAll(Sort.by("name").ascending());
    }

    public void addOrUpdateCountry(Country country) {
        repository.save(country);
    }

    public void deleteCountry(int id) {
        Country country = getSpecificCountry(id);
        if (country != null) {
            for (Person person : country.getPersons()) {
                person.setCountry(null);
            }
            country.getFilms().forEach(film -> {
                film.getCountries().remove(country);
            });
            repository.delete(country);
        }
    }
}
