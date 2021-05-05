package ru.pogodaev.movinf.actors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ru.pogodaev.movinf.persons.Person;
import ru.pogodaev.movinf.persons.PersonsService;

import java.util.Optional;

@Service
public class ActorService {
    private final ActorRepository repository;
    private final PersonsService personsService;

    @Autowired
    public ActorService(ActorRepository repository, PersonsService personsService) {
        this.repository = repository;
        this.personsService = personsService;
    }

    public Actor specificActor(long id) {
        Optional<Actor> found = repository.findById(id);
        return found.orElse(null);
    }

    public void addActor(Actor actor) {
        Person person = actor.getPerson();
        person = personsService.getSpecificPerson(person.getId());
        actor.setPerson(person);
        repository.save(actor);
    }
}
