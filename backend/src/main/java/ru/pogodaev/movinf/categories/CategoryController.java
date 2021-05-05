package ru.pogodaev.movinf.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.entities.Category;
import ru.pogodaev.movinf.repositories.CategoryRepository;

import javax.persistence.Access;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryRepository repository;

    @Autowired
    public CategoryController(CategoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> categoryById(@PathVariable("categoryId") Integer id) {
        Optional<Category> category = repository.findById(id);
        if (category.isPresent()) {
            return new ResponseEntity<>(category.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public Iterable<Category> categoryList() {
        return repository.findAll();
    }
}
