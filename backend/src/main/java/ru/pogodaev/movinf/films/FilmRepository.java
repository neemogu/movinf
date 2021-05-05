package ru.pogodaev.movinf.repositories;

import org.hibernate.annotations.SQLUpdate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.pogodaev.movinf.entities.Film;

public interface FilmRepository extends JpaRepository<Film, Long> {
     Iterable<Film> findAllByTitleContainingIgnoreCase(String s);
}
