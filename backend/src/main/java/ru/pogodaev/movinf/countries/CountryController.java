package ru.pogodaev.movinf.countries;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/countries")
public class CountryController {
    private final CountryService service;

    public CountryController(CountryService service) {
        this.service = service;
    }

    @GetMapping
    public CountriesList getList() {
        return new CountriesList(service.getList());
    }

    @GetMapping("/{countryId}")
    public ResponseEntity<Country> getCountry(@PathVariable Integer countryId) {
        Country found = service.getSpecificCountry(countryId);
        if (found != null) {
            return new ResponseEntity<>(found, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<String> addCountry(@Valid @RequestBody Country country) {
        service.addOrUpdateCountry(country);
        return ResponseEntity.ok("Country was added");
    }

    @DeleteMapping(path = "/{countryId}")
    public ResponseEntity<String> deleteCountry(@PathVariable("countryId") Integer id) {
        service.deleteCountry(id);
        return new ResponseEntity<>("Country was deleted", HttpStatus.NO_CONTENT);
    }

    @PutMapping
    public ResponseEntity<String> updateCountry(@Valid @RequestBody Country country) {
        service.addOrUpdateCountry(country);
        return ResponseEntity.ok("Country was updated");
    }
}
