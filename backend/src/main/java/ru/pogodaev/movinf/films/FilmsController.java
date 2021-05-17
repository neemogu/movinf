package ru.pogodaev.movinf.films;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.actors.Actor;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/films")
public class FilmsController {
    private final FilmService service;

    @Autowired
    public FilmsController(FilmService service) {
        this.service = service;
    }

    @GetMapping("/all/{pageNum}")
    public FilmsList getPagedList(@PathVariable("pageNum") Integer page,
                                  @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                                  @RequestParam(name = "sortBy", defaultValue = "title") String sortBy,
                                  @RequestParam(name = "sortDirection") Optional<String> sortDir,
                                  @RequestParam(name = "title", defaultValue = "") String title,
                                  @RequestParam(name = "productionDateFrom", defaultValue = "1900-01-01")
                                      @DateTimeFormat(pattern="yyyy-MM-dd") Date productionDateFrom,
                                  @RequestParam(name = "productionDateTo", defaultValue = "2100-01-01")
                                      @DateTimeFormat(pattern="yyyy-MM-dd") Date productionDateTo,
                                  @RequestParam(name = "languageId") Optional<Integer> language,
                                  @RequestParam(name = "ageRating") Optional<String> ageRating,
                                  @RequestParam(name = "categoryId") Optional<Integer> category,
                                  @RequestParam(name = "countryId") Optional<Integer> country,
                                  @RequestParam(name = "personId") Optional<Long> person,
                                  @RequestParam(name = "ratingFrom", defaultValue = "1") Integer ratingFrom,
                                  @RequestParam(name = "ratingTo", defaultValue = "10") Integer ratingTo) {
        return new FilmsList(service.getPagedList(page, pageSize, sortBy, sortDir, title,
                productionDateFrom, productionDateTo, language, ageRating, category, country, person, ratingFrom, ratingTo));
    }

    @GetMapping("/all/pages")
    public Long pageCount(@RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                             @RequestParam(name = "title", defaultValue = "") String title,
                             @RequestParam(name = "productionDateFrom", defaultValue = "1900-01-01")
                              @DateTimeFormat(pattern="yyyy-MM-dd") Date productionDateFrom,
                             @RequestParam(name = "productionDateTo", defaultValue = "2100-01-01")
                              @DateTimeFormat(pattern="yyyy-MM-dd") Date productionDateTo,
                             @RequestParam(name = "languageId") Optional<Integer> language,
                             @RequestParam(name = "ageRating") Optional<String> ageRating,
                             @RequestParam(name = "categoryId") Optional<Integer> category,
                             @RequestParam(name = "countryId") Optional<Integer> country,
                             @RequestParam(name = "personId") Optional<Long> person,
                             @RequestParam(name = "ratingFrom", defaultValue = "1") Integer ratingFrom,
                             @RequestParam(name = "ratingTo", defaultValue = "10") Integer ratingTo) {
        return service.pageCount(pageSize, title,
                productionDateFrom, productionDateTo, language, ageRating, category, country, person, ratingFrom, ratingTo);
    }

    @GetMapping("/{filmId}")
    public ResponseEntity<Film> specificFilm(@PathVariable("filmId") Long id) {
        Film found = service.specificFilm(id);
        if (found != null) {
            return new ResponseEntity<>(found, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/top")
    public Iterable<Film> getTop(@RequestParam(value = "topNum", defaultValue = "20") Integer topNum) {
        return service.getTop(topNum);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<String> addNewFilm(@RequestBody @Valid Film film) {
        service.addOrUpdateFilm(film);
        return ResponseEntity.ok("Film was successfully added");
    }

    @DeleteMapping(path = "/{filmId}")
    public ResponseEntity<String> deleteFilm(@PathVariable("filmId") Long id) {
        service.deleteFilm(id);
        return new ResponseEntity<>("Film was successfully deleted", HttpStatus.NO_CONTENT);
    }

    @PutMapping(consumes = "application/json")
    public ResponseEntity<String> updateFilm(@Valid @RequestBody Film film) {
        service.addOrUpdateFilm(film);
        return ResponseEntity.ok("Film was successfully updated");
    }

    @GetMapping("/age-ratings")
    public Iterable<Film.AgeRating> getAgeRatings() {
        return Arrays.asList(Film.AgeRating.values());
    }
}
