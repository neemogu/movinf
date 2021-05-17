package ru.pogodaev.movinf.languages;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/languages")
public class LanguageController {
    private final LanguageService service;

    public LanguageController(LanguageService service) {
        this.service = service;
    }

    @GetMapping
    public LanguagesList getList() {
        return new LanguagesList(service.getList());
    }

    @PostMapping
    public ResponseEntity<String> addLanguage(@Valid @RequestBody Language language) {
        service.addOrUpdateLanguage(language);
        return ResponseEntity.ok("Language was added");
    }

    @PutMapping
    public ResponseEntity<String> updateLanguage(@Valid @RequestBody Language language) {
        service.addOrUpdateLanguage(language);
        return ResponseEntity.ok("Language was updated");
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> deleteLanguage(@PathVariable("id") Integer id) {
        service.deleteLanguage(id);
        return new ResponseEntity<>("Language was deleted", HttpStatus.NO_CONTENT);
    }
}
