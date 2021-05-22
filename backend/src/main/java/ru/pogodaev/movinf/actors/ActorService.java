package ru.pogodaev.movinf.actors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
