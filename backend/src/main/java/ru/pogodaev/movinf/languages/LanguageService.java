package ru.pogodaev.movinf.languages;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.pogodaev.movinf.countries.Country;
import ru.pogodaev.movinf.films.Film;
import ru.pogodaev.movinf.films.FilmService;
import ru.pogodaev.movinf.persons.Person;

import java.util.List;
import java.util.Optional;

@Service
public class LanguageService {
    private final LanguageRepository repository;
    private final FilmService filmService;

    public LanguageService(LanguageRepository repository, FilmService filmService) {
        this.repository = repository;
        this.filmService = filmService;
    }

    public Language getSpecificLanguage(int id) {
        Optional<Language> found = repository.findById(id);
        return found.orElse(null);
    }

    public List<Language> getList() {
        return repository.findAll(Sort.by("name").ascending());
    }

    public void addOrUpdateLanguage(Language language) {
        repository.save(language);
    }

    public void deleteLanguage(int id) {
        repository.findById(id).ifPresent((Language foundLanguage) -> {
            for (Film film : foundLanguage.getFilms()) {
                film.setLanguage(null);
                filmService.addOrUpdateFilm(film);
            }
        });
        repository.deleteById(id);
    }
}
