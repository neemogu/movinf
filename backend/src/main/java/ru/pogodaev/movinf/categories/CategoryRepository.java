package ru.pogodaev.movinf.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.pogodaev.movinf.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
