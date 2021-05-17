package ru.pogodaev.movinf.actors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ru.pogodaev.movinf.persons.Person;
import ru.pogodaev.movinf.persons.PersonsService;

import javax.validation.Valid;
import java.util.Optional;

@Service
public class ActorService {
    private final ActorRepository repository;

    @Autowired
    public ActorService(ActorRepository repository) {
        this.repository = repository;
    }

    public Actor addActor(Actor actor) {
        return repository.save(actor);
    }

    public void deleteActor(Actor actor) {
        repository.delete(actor);
    }

    public boolean exist(Actor actor) {
        return repository.existsById(actor.getId());
    }
}
