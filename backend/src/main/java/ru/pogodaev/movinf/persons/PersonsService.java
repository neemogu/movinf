package ru.pogodaev.movinf.persons;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import ru.pogodaev.movinf.countries.Country;
import ru.pogodaev.movinf.countries.CountryService;

import java.sql.Date;
import java.util.Optional;

@Service
public class PersonsService {
    private final PersonRepository repository;

    @Autowired
    public PersonsService(PersonRepository repository) {
        this.repository = repository;
    }

    public Person getSpecificPerson(long id) {
        Optional<Person> person = repository.findById(id);
        return person.orElse(null);
    }

    public Iterable<Person> getPagedList(int page, int pageSize, String sortBy) {
        PageRequest pr = PageRequest.of(page, pageSize, Sort.by(sortBy).descending());
        return repository.findAll(pr).getContent();
    }

    public Iterable<Person> getAll() {
        return repository.findAll(Sort.by("firstname").ascending());
    }

    public int pageCount(int pageSize) {
        PageRequest pr = PageRequest.of(0, pageSize);
        return repository.findAll(pr).getTotalPages();
    }

    public void addOrUpdatePerson(Person person) {
        repository.save(person);
    }

    public void deletePerson(long id) {
        repository.deleteById(id);
    }
}
