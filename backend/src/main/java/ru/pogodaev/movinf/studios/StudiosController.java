package ru.pogodaev.movinf.studios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/studios")
public class StudiosController {

    private final StudioService service;

    @Autowired
    public StudiosController(StudioService service) {
        this.service = service;
    }

    @GetMapping("/{studioId}")
    public ResponseEntity<Studio> studioFilms(@PathVariable Integer studioId) {
        Studio foundStudio = service.specificStudio(studioId);
        if (foundStudio != null) {
            return ResponseEntity.ok(foundStudio);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping()
    public StudiosList studiosList() {
        return new StudiosList(service.studiosList());
    }

    @PostMapping
    public ResponseEntity<String> addStudio(@Valid @RequestBody Studio studio) {
        service.addOrUpdateStudio(studio);
        return ResponseEntity.ok("Studio was added");
    }

    @PutMapping
    public ResponseEntity<String> updateStudio(@Valid @RequestBody Studio studio) {
        service.addOrUpdateStudio(studio);
        return ResponseEntity.ok("Studio was updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudio(@PathVariable("id") Integer id) {
        service.deleteStudio(id);
        return new ResponseEntity<>("Studio was deleted", HttpStatus.NO_CONTENT);
    }
}
