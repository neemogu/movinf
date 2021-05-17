package ru.pogodaev.movinf.actors;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorRepository extends JpaRepository<Actor, Long> {
    boolean existsById(@NonNull Long id);
}
