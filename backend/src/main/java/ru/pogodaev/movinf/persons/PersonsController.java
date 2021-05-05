package ru.pogodaev.movinf.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.entities.Film;
import ru.pogodaev.movinf.entities.Person;
import ru.pogodaev.movinf.repositories.PersonRepository;

import java.util.Optional;

@RestController
@RequestMapping("/persons")
public class PersonsController {
    private final PersonRepository repository;

    @Autowired
    public PersonsController(PersonRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{personId}")
    public ResponseEntity<Person> specificPerson(@PathVariable("personId") Long id) {
        Optional<Person> person = repository.findById(id);
        if (person.isPresent()) {
            return new ResponseEntity<>(person.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all/{pageNum}")
    public Iterable<Person> getPagedList(@PathVariable("pageNum") Optional<Integer> page,
                                       @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                                         @RequestParam(name = "sortby", defaultValue = "lastname") String sortBy) {
        int pageNum = 0;
        if (page.isPresent()) {
            pageNum = page.get();
        }
        PageRequest pr = PageRequest.of(pageNum, pageSize, Sort.by(sortBy).descending());
        return repository.findAll(pr).getContent();
    }

    @GetMapping("/all/pages")
    public Integer pageCount(@RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize) {
        PageRequest pr = PageRequest.of(0, pageSize);
        return repository.findAll(pr).getTotalPages();
    }
}
