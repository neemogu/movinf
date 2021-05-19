package ru.pogodaev.movinf.persons;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import ru.pogodaev.movinf.actors.Actor;
import ru.pogodaev.movinf.actors.ActorService;
import ru.pogodaev.movinf.categories.Category;
import ru.pogodaev.movinf.countries.Country;
import ru.pogodaev.movinf.films.Film;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import javax.persistence.criteria.*;
import java.util.*;

@Service
public class PersonsService {
    private final PersonRepository repository;
    private final ActorService actorService;

    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    public PersonsService(PersonRepository repository, ActorService actorService) {
        this.repository = repository;
        this.actorService = actorService;
    }

    public Person getSpecificPerson(long id) {
        Optional<Person> person = repository.findById(id);
        person.ifPresent(value -> value.getAsActorFilms().sort(Comparator.comparing(a -> a.getFilm().getProductionDate(),
                Comparator.reverseOrder())));
        person.ifPresent(value -> value.getAsDirectorFilms().sort(Comparator.comparing(Film::getProductionDate,
                Comparator.reverseOrder())));
        person.ifPresent(value -> value.getAsProducerFilms().sort(Comparator.comparing(Film::getProductionDate,
                Comparator.reverseOrder())));
        person.ifPresent(value -> value.getAsScenaristFilms().sort(Comparator.comparing(Film::getProductionDate,
                Comparator.reverseOrder())));
        return person.orElse(null);
    }

    private void getPredicates(CriteriaBuilder builder,
                               Root<Person> root,
                               List<Predicate> wherePredicates,
                               String firstname,
                               String lastname,
                               Date birthdateFrom,
                               Date birthdateTo,
                               Optional<Integer> country) {
        if (!firstname.equals("")) {
            wherePredicates.add(builder.like(builder.lower(root.get("firstname")), "%" + firstname.toLowerCase() + "%"));
        }
        if (!firstname.equals("")) {
            wherePredicates.add(builder.like(builder.lower(root.get("lastname")), "%" + lastname.toLowerCase() + "%"));
        }
        wherePredicates.add(builder.between(root.get("birthdate"), birthdateFrom, birthdateTo));
        if (country.isPresent()) {
            wherePredicates.add(builder.equal(root.get("country").get("id"), country.get()));
        }
    }

    public Iterable<Person> getPagedList(int page,
                                         int pageSize,
                                         String sortBy,
                                         Optional<String> sortDir,
                                         String firstname,
                                         String lastname,
                                         Date birthdateFrom,
                                         Date birthdateTo,
                                         Optional<Integer> country) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Person> query = builder.createQuery(Person.class);
        Root<Person> root = query.from(Person.class);

        List<Predicate> wherePredicates = new LinkedList<>();

        getPredicates(builder, root, wherePredicates,
                firstname, lastname, birthdateFrom, birthdateTo, country);

        if (sortDir.isPresent() && sortDir.get().equals("asc")) {
            query.orderBy(builder.asc(root.get(sortBy)));
        } else if (sortDir.isPresent() && sortDir.get().equals("desc")) {
            query.orderBy(builder.desc(root.get(sortBy)));
        }
        query.where(builder.and(wherePredicates.toArray(new Predicate[0])));
        Iterable<Person> result = em.createQuery(query.select(root)).setFirstResult(page * pageSize).setMaxResults(pageSize).getResultList();
        em.getTransaction().commit();
        em.close();
        return result;
    }

    public Iterable<Person> getAll() {
        return repository.findAll(Sort.by("firstname").ascending());
    }

    public long pageCount(int pageSize,
                         String firstname,
                         String lastname,
                         Date birthdateFrom,
                         Date birthdateTo,
                         Optional<Integer> country) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Person> root = query.from(Person.class);

        List<Predicate> wherePredicates = new LinkedList<>();

        getPredicates(builder, root, wherePredicates,
                firstname, lastname, birthdateFrom, birthdateTo, country);

        query.select(builder.count(root));
        query.where(builder.and(wherePredicates.toArray(new Predicate[0])));
        Long result = em.createQuery(query).getSingleResult();
        em.getTransaction().commit();
        em.close();
        return result / pageSize +(result % pageSize == 0 ? 0 : 1);
    }

    public void addOrUpdatePerson(Person person) {
        repository.save(person);
    }

    public void deletePerson(long id) {
        Person person = getSpecificPerson(id);
        person.getAsScenaristFilms().forEach((film) -> {
            film.getScenarists().remove(person);
        });
        person.getAsDirectorFilms().forEach((film) -> {
            film.getDirectors().remove(person);
        });
        person.getAsProducerFilms().forEach((film) -> {
            film.getProducers().remove(person);
        });
        deleteActors(person);
        addOrUpdatePerson(person);
        repository.delete(person);
    }

    private void deleteActors(Person person) {
        if (person.getAsActorFilms() != null) {
            for (Actor actor : person.getAsActorFilms()) {
                actorService.deleteActor(actor);
            }
            person.getAsActorFilms().clear();
        }
    }
}
