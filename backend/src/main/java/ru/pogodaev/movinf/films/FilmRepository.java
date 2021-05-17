package ru.pogodaev.movinf.films;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ru.pogodaev.movinf.films.Film;

public interface FilmRepository extends JpaRepository<Film, Long> {
}
