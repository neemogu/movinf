package ru.pogodaev.movinf.films;

import org.hibernate.query.criteria.internal.CriteriaBuilderImpl;
import org.springframework.data.jpa.domain.Specification;
import ru.pogodaev.movinf.countries.Country;

import javax.persistence.criteria.Join;
import java.util.Date;

public class FilmSpecifications {


    public static Specification<Film> titleContains(String expr) {
        return (root, query, cb) -> {
            return cb.like(cb.lower(root.get("title")), "%" + expr.toLowerCase() + "%");
        };
    }

    public static Specification<Film> productionDateBetween(Date from, Date to) {
        return (root, query, cb) -> {
            return cb.between(root.get("productionDate"), from, to);
        };
    }

    public static Specification<Film> languageIs(int languageId) {
        return (root, query, cb) -> {
            return cb.equal(root.get("language").get("id"), languageId);
        };
    }

    public static Specification<Film> ageRatingIs(Film.AgeRating ageRating) {
        return (root, query, cb) -> {
            return cb.equal(root.get("ageRating"), ageRating);
        };
    }

    public static Specification<Film> countryIs(Integer countryId) {
        return (root, query, cb) -> {

            return cb.in(root.join("countries"));
        };
    }
}
