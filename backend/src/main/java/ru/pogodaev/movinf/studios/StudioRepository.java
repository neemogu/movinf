package ru.pogodaev.movinf.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.pogodaev.movinf.entities.Studio;

public interface StudioRepository extends JpaRepository<Studio, Integer> {
}
