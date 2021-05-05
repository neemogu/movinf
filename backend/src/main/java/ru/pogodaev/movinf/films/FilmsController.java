package ru.pogodaev.movinf.controllers;

import com.fasterxml.jackson.annotation.JsonValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.entities.Film;
import ru.pogodaev.movinf.repositories.FilmRepository;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/films")
public class FilmsController {
    private final FilmRepository repository;

    @Autowired
    public FilmsController(FilmRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/all/{pageNum}")
    public Iterable<Film> getPagedList(@PathVariable("pageNum") Optional<Integer> page,
                                       @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize) {
        int pageNum = 0;
        if (page.isPresent()) {
            pageNum = page.get();
        }
        PageRequest pr = PageRequest.of(pageNum, pageSize, Sort.by("title").descending());
        return repository.findAll(pr).getContent();
    }

    @GetMapping("/all/pages")
    public Integer pageCount(@RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize) {
        PageRequest pr = PageRequest.of(0, pageSize, Sort.by("title").descending());
        return repository.findAll(pr).getTotalPages();
    }

    @GetMapping("/{filmId}")
    public ResponseEntity<Film> specificFilm(@PathVariable("filmId") Long id) {
        Optional<Film> found = repository.findById(id);
        if (found.isPresent()) {
            return new ResponseEntity<>(found.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public Iterable<Film> getSearched(@RequestParam("title") String title) {
        return repository.findAllByTitleContainingIgnoreCase(title);
    }

    @GetMapping("/top20")
    public Iterable<Film> getTop50() {
        PageRequest pr = PageRequest.of(0, 50, Sort.by("rating").descending());
        return repository.findAll(pr);
    }

    @PostMapping(path = "/new", consumes = "application/json")
    public ResponseEntity<String> addNewFilm(@RequestBody @Valid Film film) {
        repository.save(film);
        return ResponseEntity.ok("Film was successfully added");
    }
}
