package ru.pogodaev.movinf.categories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoryService {
    private final CategoryRepository repository;

    @Autowired
    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public Category categoryById(int id) {
        Optional<Category> category = repository.findById(id);
        return category.orElse(null);
    }

    public Iterable<Category> categoryList() {
        return repository.findAll(Sort.by("name").ascending());
    }

    public void addOrUpdateCategory(Category category) {
        repository.save(category);
    }

    public void deleteCategory(int id) {
        Category category = categoryById(id);
        if (category != null) {
            category.getFilms().forEach(film -> {
                film.getCategories().remove(category);
            });
            repository.delete(category);
        }
    }
}
