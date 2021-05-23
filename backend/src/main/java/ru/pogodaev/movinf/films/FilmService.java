package ru.pogodaev.movinf.films;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.pogodaev.movinf.actors.Actor;
import ru.pogodaev.movinf.actors.ActorService;
import ru.pogodaev.movinf.categories.Category;
import ru.pogodaev.movinf.countries.Country;
import ru.pogodaev.movinf.persons.Person;
import ru.pogodaev.movinf.reviews.Review;
import ru.pogodaev.movinf.reviews.ReviewRepository;
import ru.pogodaev.movinf.reviews.ReviewService;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import javax.persistence.criteria.*;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class FilmService {
    private final FilmRepository filmRepository;
    private final ActorService actorService;
    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;

    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    public FilmService(FilmRepository filmRepository, ActorService actorService, ReviewService reviewService,
                       ReviewRepository reviewRepository) {
        this.filmRepository = filmRepository;
        this.actorService = actorService;
        this.reviewService = reviewService;
        this.reviewRepository = reviewRepository;
    }

    private void getPredicates(CriteriaBuilder builder,
                                          Root<Film> root,
                                          List<Predicate> wherePredicates,
                                          List<Predicate> havingPredicates,
                                          String title,
                                          Date productionDateStart, Date productionDateEnd,
                                          Optional<Integer> languageId,
                                          Optional<String> ageRating,
                                          Optional<Integer> categoryId,
                                          Optional<Integer> countryId,
                                          Optional<Long> personId,
                                          int ratingFrom,
                                          int ratingTo) {
        if (!title.equals("")) {
            wherePredicates.add(builder.like(builder.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
        }
        wherePredicates.add(builder.between(root.get("productionDate"), productionDateStart, productionDateEnd));
        if (languageId.isPresent()) {
            wherePredicates.add(builder.equal(root.get("language").get("id"), languageId.get()));
        }
        if (ageRating.isPresent()) {
            wherePredicates.add(builder.equal(root.get("ageRating"), Film.AgeRating.fromStrValue(ageRating.get())));
        }
        wherePredicates.add(builder.or(builder.between(root.get("rating"), ratingFrom, ratingTo), builder.isNull(root.get("rating"))));
        if (categoryId.isPresent()) {
            Join<Film, Category> categoryJoin = root.join("categories");
            wherePredicates.add(builder.equal(categoryJoin.get("id"), categoryId.get()));
            havingPredicates.add(builder.greaterThan(builder.count(categoryJoin), 0L));
        }
        if (countryId.isPresent()) {
            Join<Film, Country> countryJoin = root.join("countries");
            wherePredicates.add(builder.equal(countryJoin.get("id"), countryId.get()));
            havingPredicates.add(builder.greaterThan(builder.count(countryJoin), 0L));
        }
        if (personId.isPresent()) {
            Join<Film, Person> scenaristJoin = root.join("scenarists");
            Join<Film, Person> producerJoin = root.join("producers");
            Join<Film, Person> directorJoin = root.join("directors");
            Join<Film, Actor> actorJoin = root.join("actors");
            wherePredicates.add(builder.or(
                    builder.equal(scenaristJoin.get("id"), personId.get()),
                    builder.equal(directorJoin.get("id"), personId.get()),
                    builder.equal(producerJoin.get("id"), personId.get()),
                    builder.equal(actorJoin.get("person").get("id"), personId.get())
            ));
            havingPredicates.add(builder.or(
                    builder.greaterThan(builder.countDistinct(scenaristJoin), 0L),
                    builder.greaterThan(builder.countDistinct(directorJoin), 0L),
                    builder.greaterThan(builder.countDistinct(producerJoin), 0L),
                    builder.greaterThan(builder.countDistinct(actorJoin), 0L)
            ));
        }
    }

    public Iterable<FilmListElement> getPagedList(int page, int pageSize,
                                       String sortBy, Optional<String> sortDir,
                                       String title,
                                       Date productionDateStart, Date productionDateEnd,
                                       Optional<Integer> languageId,
                                       Optional<String> ageRating,
                                       Optional<Integer> categoryId,
                                       Optional<Integer> countryId,
                                       Optional<Long> personId,
                                       int ratingFrom,
                                       int ratingTo) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Film> query = builder.createQuery(Film.class);
        Root<Film> root = query.from(Film.class);

        List<Predicate> wherePredicates = new LinkedList<>();
        List<Predicate> havingPredicates = new LinkedList<>();

        getPredicates(builder, root, wherePredicates,havingPredicates,
                title, productionDateStart, productionDateEnd,
                languageId, ageRating, categoryId, countryId, personId, ratingFrom, ratingTo);

        if (sortDir.isPresent() && sortDir.get().equals("asc")) {
            query.orderBy(builder.asc(root.get(sortBy)));
        } else if (sortDir.isPresent() && sortDir.get().equals("desc")) {
            query.orderBy(builder.desc(root.get(sortBy)));
        }
        query.where(builder.and(wherePredicates.toArray(new Predicate[0])));
        query.having(builder.and(havingPredicates.toArray(new Predicate[0])));
        query.distinct(true);
        Iterable<Film> result = em.createQuery(query.select(root)).setFirstResult(page * pageSize).setMaxResults(pageSize).getResultList();
        List<FilmListElement> resultList = new LinkedList<>();
        for (Film film: result) {
            film.getCountries().size();
            film.getCategories().size();
            resultList.add(new FilmListElement(film, reviewRepository.getReviewsCountByFilm(film.getId())));
        }
        em.getTransaction().commit();
        em.close();
        return resultList;
    }

    public long pageCount(int pageSize,
                         String title,
                         Date productionDateStart, Date productionDateEnd,
                         Optional<Integer> languageId,
                         Optional<String> ageRating,
                         Optional<Integer> categoryId,
                         Optional<Integer> countryId,
                         Optional<Long> personId,
                         int ratingFrom,
                         int ratingTo) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Film> root = query.from(Film.class);

        List<Predicate> wherePredicates = new LinkedList<>();
        List<Predicate> havingPredicates = new LinkedList<>();

        getPredicates(builder, root, wherePredicates, havingPredicates,
                title, productionDateStart, productionDateEnd,
                languageId, ageRating, categoryId, countryId, personId, ratingFrom, ratingTo);

        query.select(builder.countDistinct(root));
        query.where(builder.and(wherePredicates.toArray(new Predicate[0])));
        query.having(builder.and(havingPredicates.toArray(new Predicate[0])));
        Long result = em.createQuery(query).getSingleResult();
        em.getTransaction().commit();
        em.close();
        return result / pageSize +(result % pageSize == 0 ? 0 : 1);
    }

    public FilmWithReviews specificFilm(long id) {
        Optional<Film> found = filmRepository.findById(id);
        if (found.isPresent()) {
            Film film = found.get();
            return new FilmWithReviews(film, reviewRepository.getFirstReviewsByFilm(film.getId(), 3),
                    reviewRepository.getReviewsCountByFilm(film.getId()));
        } else {
            return null;
        }
    }

    public void deleteFilm(long id) {
        Optional<Film> found = filmRepository.findById(id);
        if (found.isEmpty()) {
            return;
        }
        Film film = found.get();
        film.getDirectors().clear();
        film.getProducers().clear();
        film.getScenarists().clear();
        film.getCategories().clear();
        film.getStudios().clear();
        film.getCountries().clear();
        deleteReviews(film);
        deleteActors(film);
        addOrUpdateFilm(film);
        filmRepository.delete(film);
    }

    public void addOrUpdateFilm(Film film) {
        if (film.getId() != null) {
            Optional<Film> found = filmRepository.findById(film.getId());
            if (found.isEmpty()) {
                return;
            }
            Film prev = found.get();
            deleteActors(prev);
            saveActors(film);
            filmRepository.save(film);
        } else {
            Film saved = filmRepository.save(film);
            film.setId(saved.getId());
            saveActors(film);
        }
    }

    private void deleteActors(Film film) {
        if (film.getActors() != null) {
            for (Actor actor : film.getActors()) {
                actorService.deleteActor(actor);
            }
            film.getActors().clear();
        }
    }

    private void deleteReviews(Film film) {
        if (film.getReviews() != null) {
            for (Review review : film.getReviews()) {
                reviewService.deleteReview(review);
            }
            film.getReviews().clear();
        }
    }

    private void saveActors(Film film) {
        if (film.getActors() != null) {
            for (Actor actor : film.getActors()) {
                actor.setFilm(film);
                Actor newActor = actorService.addActor(actor);
                actor.setId(newActor.getId());
            }
        }
    }
}
