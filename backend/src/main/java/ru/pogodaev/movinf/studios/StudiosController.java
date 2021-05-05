package ru.pogodaev.movinf.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.pogodaev.movinf.entities.Film;
import ru.pogodaev.movinf.entities.Studio;
import ru.pogodaev.movinf.repositories.StudioRepository;

import javax.persistence.Access;
import java.util.Optional;

@RestController
@RequestMapping("/studios")
public class StudiosController {
    private final StudioRepository repository;

    @Autowired
    public StudiosController(StudioRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{studioId}")
    public ResponseEntity<Studio> studioFilms(@PathVariable Integer studioId) {
        Optional<Studio> foundStudio = repository.findById(studioId);
        if (foundStudio.isPresent()) {
            return ResponseEntity.ok(foundStudio.get());
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
