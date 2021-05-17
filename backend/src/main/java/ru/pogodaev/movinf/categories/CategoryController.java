package ru.pogodaev.movinf.categories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.countries.Country;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService service;

    @Autowired
    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> categoryById(@PathVariable("categoryId") Integer id) {
        Category category = service.categoryById(id);
        if (category != null) {
            return new ResponseEntity<>(category, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public CategoriesList categoryList() {
        return new CategoriesList(service.categoryList());
    }

    @PostMapping
    public ResponseEntity<String> addCategory(@Valid @RequestBody Category category) {
        service.addOrUpdateCategory(category);
        return ResponseEntity.ok("Category was added");
    }

    @PutMapping
    public ResponseEntity<String> updateCategory(@Valid @RequestBody Category category) {
        service.addOrUpdateCategory(category);
        return ResponseEntity.ok("Category was updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable("id") Integer id) {
        service.deleteCategory(id);
        return new ResponseEntity<>("Category was deleted", HttpStatus.NO_CONTENT);
    }
}
