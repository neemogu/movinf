package ru.pogodaev.movinf.reviews;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.pogodaev.movinf.films.Film;
import ru.pogodaev.movinf.users.User;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    private final ReviewRepository repository;

    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    public ReviewService(ReviewRepository repository) {
        this.repository = repository;
    }

    public Review addOrUpdateReview(Review review) {
        return repository.save(review);
    }

    public void deleteReview(long userId, long filmId) {
        Film film = new Film();
        film.setId(filmId);
        User user = new User();
        user.setId(userId);
        repository.deleteById(new ReviewId(film, user));
    }

    public void deleteReview(Review review) {
        repository.delete(review);
    }

    private Iterable<Review> getReviews(long id,
                                        String selectField,
                                        int page,
                                        int pageSize,
                                        String sortBy,
                                        Optional<String> sortDir,
                                        int ratingFrom,
                                        int ratingTo,
                                        Date postDateFrom,
                                        Date postDateTo) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Review> query = builder.createQuery(Review.class);
        Root<Review> root = query.from(Review.class);

        List<Predicate> wherePredicates = new LinkedList<>();

        wherePredicates.add(builder.or(builder.between(root.get("rating"), ratingFrom, ratingTo),
                builder.isNull(root.get("rating"))));
        wherePredicates.add(builder.between(root.get("postDate"), postDateFrom, postDateTo));
        wherePredicates.add(builder.equal(root.get("id").get(selectField).get("id"), id));

        if (sortDir.isPresent() && sortDir.get().equals("asc")) {
            if (sortBy.equals("username")) {
                query.orderBy(builder.asc(root.get("id").get("user").get(sortBy)));
            } else if (sortBy.equals("title")) {
                query.orderBy(builder.asc(root.get("id").get("film").get(sortBy)));
            } else {
                query.orderBy(builder.asc(root.get(sortBy)));
            }
        } else if (sortDir.isPresent() && sortDir.get().equals("desc")) {
            if (sortBy.equals("username")) {
                query.orderBy(builder.desc(root.get("id").get("user").get(sortBy)));
            } else if (sortBy.equals("title")) {
                query.orderBy(builder.desc(root.get("id").get("film").get(sortBy)));
            } else {
                query.orderBy(builder.desc(root.get(sortBy)));
            }
        }
        query.where(builder.and(wherePredicates.toArray(new Predicate[0])));
        Iterable<Review> result = em.createQuery(query.select(root)).setFirstResult(page * pageSize)
                .setMaxResults(pageSize).getResultList();
        em.getTransaction().commit();
        em.close();
        return result;
    }

    private Long getReviewsPages(long id,
                                 String selectField,
                                 int pageSize,
                                 int ratingFrom,
                                 int ratingTo,
                                 Date postDateFrom,
                                 Date postDateTo) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Review> root = query.from(Review.class);

        List<Predicate> wherePredicates = new LinkedList<>();

        wherePredicates.add(builder.or(builder.between(root.get("rating"), ratingFrom, ratingTo),
                builder.isNull(root.get("rating"))));
        wherePredicates.add(builder.between(root.get("postDate"), postDateFrom, postDateTo));
        wherePredicates.add(builder.equal(root.get("id").get(selectField).get("id"), id));

        query.where(builder.and(wherePredicates.toArray(new Predicate[0])));
        query.select(builder.countDistinct(root));
        Long result = em.createQuery(query).getSingleResult();
        em.getTransaction().commit();
        em.close();
        return result / pageSize +(result % pageSize == 0 ? 0 : 1);
    }

    public Iterable<Review> filmReviews(long filmId,
                                        int page,
                                        int pageSize,
                                        String sortBy,
                                        Optional<String> sortDir,
                                        int ratingFrom,
                                        int ratingTo,
                                        Date postDateFrom,
                                        Date postDateTo) {
        return getReviews(filmId, "film", page, pageSize, sortBy, sortDir, ratingFrom, ratingTo, postDateFrom, postDateTo);
    }

    public Iterable<Review> userReviews(long userId,
                                        int page,
                                        int pageSize,
                                        String sortBy,
                                        Optional<String> sortDir,
                                        int ratingFrom,
                                        int ratingTo,
                                        Date postDateFrom,
                                        Date postDateTo) {
        return getReviews(userId, "user", page, pageSize, sortBy, sortDir, ratingFrom, ratingTo, postDateFrom, postDateTo);
    }

    public Long filmReviewsPages(long filmId,
                                 int pageSize,
                                 int ratingFrom,
                                 int ratingTo,
                                 Date postDateFrom,
                                 Date postDateTo) {
        return getReviewsPages(filmId, "film", pageSize, ratingFrom, ratingTo, postDateFrom, postDateTo);
    }

    public Long userReviewsPages(long userId,
                                 int pageSize,
                                 int ratingFrom,
                                 int ratingTo,
                                 Date postDateFrom,
                                 Date postDateTo) {
        return getReviewsPages(userId, "user", pageSize, ratingFrom, ratingTo, postDateFrom, postDateTo);
    }

    public boolean exist(long userId, long filmId) {
        return repository.exist(filmId, userId);
    }

    public Review specificReview(long userId, long filmId) {
        return repository.find(filmId, userId).orElse(null);
    }
}
