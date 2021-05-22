package ru.pogodaev.movinf.studios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudioService {
    private final StudioRepository repository;

    @Autowired
    public StudioService(StudioRepository repository) {
        this.repository = repository;
    }

    public Studio specificStudio(int studioId) {
        Optional<Studio> foundStudio = repository.findById(studioId);
        return foundStudio.orElse(null);
    }

    public Iterable<Studio> studiosList() {
        return repository.findAll(Sort.by("name").ascending());
    }

    public void addOrUpdateStudio(Studio studio) {
        repository.save(studio);
    }

    public void deleteStudio(int id) {
        Studio studio = specificStudio(id);
        if (studio != null) {
            studio.getFilms().forEach(film -> {
                film.getStudios().remove(studio);
            });
            repository.delete(studio);
        }
    }
}
