package ru.pogodaev.movinf.users;

import org.springframework.stereotype.Service;
import ru.pogodaev.movinf.reviews.ReviewRepository;

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
public class UserService {
    private final UserRepository repository;
    private final ReviewRepository reviewRepository;

    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    public UserService(UserRepository repository, ReviewRepository reviewRepository) {
        this.repository = repository;
        this.reviewRepository = reviewRepository;
    }

    private void getPredicates(CriteriaBuilder builder,
                               Root<User> root,
                               List<Predicate> wherePredicates,
                               String username,
                               String firstname,
                               String lastname,
                               String email,
                               Date birthdateFrom,
                               Date birthdateTo,
                               Optional<String> gender,
                               Date regDateFrom,
                               Date regDateTo) {
        wherePredicates.add(builder.notEqual(root.get("role"), User.UserRole.ADMIN));
        if (!username.equals("")) {
            wherePredicates.add(
                    builder.like(builder.lower(root.get("username")), "%" + username.toLowerCase() + "%")
            );
        }
        if (!firstname.equals("")) {
            wherePredicates.add(builder.and(
                    builder.isNotNull(root.get("firstname")),
                    builder.like(builder.lower(root.get("firstname")), "%" + firstname.toLowerCase() + "%")
            ));
        }
        if (!lastname.equals("")) {
            wherePredicates.add(builder.and(
                    builder.isNotNull(root.get("lastname")),
                    builder.like(builder.lower(root.get("lastname")), "%" + lastname.toLowerCase() + "%")
            ));
        }
        if (!email.equals("")) {
            wherePredicates.add(
                    builder.like(builder.lower(root.get("email")), "%" + email.toLowerCase() + "%")
            );
        }
        wherePredicates.add(
                builder.or(
                        builder.isNull(root.get("birthdate")),
                        builder.between(root.get("birthdate"), birthdateFrom, birthdateTo)
                ));
        wherePredicates.add(builder.between(root.get("registrationDate"), regDateFrom, regDateTo));
        if (gender.isPresent()) {
            wherePredicates.add(builder.equal(root.get("gender"), User.Gender.fromStrValue(gender.get())));
        }
    }

    public Iterable<UserListElement> getPagedList(int page,
                                                  int pageSize,
                                                  String sortBy,
                                                  Optional<String> sortDir,
                                                  String username,
                                                  String firstname,
                                                  String lastname,
                                                  String email,
                                                  Date birthdateFrom,
                                                  Date birthdateTo,
                                                  Optional<String> gender,
                                                  Date regDateFrom,
                                                  Date regDateTo) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<User> query = builder.createQuery(User.class);
        Root<User> root = query.from(User.class);

        List<Predicate> wherePredicates = new LinkedList<>();

        getPredicates(builder, root, wherePredicates, username, firstname, lastname, email,
                birthdateFrom, birthdateTo, gender, regDateFrom, regDateTo);

        if (sortDir.isPresent() && sortDir.get().equals("asc")) {
            query.orderBy(builder.asc(root.get(sortBy)));
        } else if (sortDir.isPresent() && sortDir.get().equals("desc")) {
            query.orderBy(builder.desc(root.get(sortBy)));
        }
        query.where(builder.and(wherePredicates.toArray(new Predicate[0])));
        Iterable<User> result = em.createQuery(query.select(root)).setFirstResult(page * pageSize)
                .setMaxResults(pageSize).getResultList();
        List<UserListElement> resultList = new LinkedList<>();
        for (User user: result) {
            resultList.add(new UserListElement(user, reviewRepository.getReviewsCountByUser(user.getId())));
        }
        em.getTransaction().commit();
        em.close();
        return resultList;
    }

    public long pageCount(int pageSize,
                          String username,
                          String firstname,
                          String lastname,
                          String email,
                          Date birthdateFrom,
                          Date birthdateTo,
                          Optional<String> gender,
                          Date regDateFrom,
                          Date regDateTo) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<User> root = query.from(User.class);

        List<Predicate> wherePredicates = new LinkedList<>();

        getPredicates(builder, root, wherePredicates, username, firstname, lastname, email,
                birthdateFrom, birthdateTo, gender, regDateFrom, regDateTo);

        query.select(builder.count(root));
        query.where(builder.and(wherePredicates.toArray(new Predicate[0])));
        Long result = em.createQuery(query).getSingleResult();
        em.getTransaction().commit();
        em.close();
        return result / pageSize +(result % pageSize == 0 ? 0 : 1);
    }

    public UserWithReviews getUserById(long userId) {
        Optional<User> foundUser =  repository.findById(userId);
        if (foundUser.isPresent() && foundUser.get().getRole() == User.UserRole.ADMIN || foundUser.isEmpty()) {
            return null;
        }
        User user = foundUser.get();
        return new UserWithReviews(user, reviewRepository.getFirstReviewsByUser(user.getId(), 3),
                    reviewRepository.getReviewsCountByUser(user.getId()));
    }

    public void addOrUpdateUser(User user) {
        repository.save(user);
    }
}
