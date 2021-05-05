package ru.pogodaev.movinf.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.pogodaev.movinf.entities.Person;

public interface PersonRepository extends JpaRepository<Person, Long> {

}
