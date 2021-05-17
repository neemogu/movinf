package ru.pogodaev.movinf.persons;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/persons")
public class PersonsController {
    private final PersonsService service;

    @Autowired
    public PersonsController(PersonsService service) {
        this.service = service;
    }

    @GetMapping("/{personId}")
    public ResponseEntity<Person> specificPerson(@PathVariable("personId") Long id) {
        Person person = service.getSpecificPerson(id);
        if (person != null) {
            return new ResponseEntity<>(person, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public PersonsList getList() {
        return new PersonsList(service.getAll());
    }

    @GetMapping("/all/{pageNum}")
    public Iterable<Person> getPagedList(@PathVariable("pageNum") Integer page,
                                         @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                                         @RequestParam(name = "sortBy", defaultValue = "lastname") String sortBy) {
        return service.getPagedList(page, pageSize, sortBy);
    }

    @GetMapping("/all/pages")
    public Integer pageCount(@RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize) {
        return service.pageCount(pageSize);
    }

    @PostMapping
    public ResponseEntity<String> addPerson(@Valid @RequestBody Person person) {
        service.addOrUpdatePerson(person);
        return ResponseEntity.ok("Person was added");
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> deletePerson(@PathVariable("id") Long id) {
        service.deletePerson(id);
        return new ResponseEntity<>("Person was deleted", HttpStatus.NO_CONTENT);
    }

    @PutMapping
    public ResponseEntity<String> updatePerson(@Valid @RequestBody Person person) {
        service.addOrUpdatePerson(person);
        return ResponseEntity.ok("Person was updated");
    }
}
