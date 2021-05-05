package ru.pogodaev.movinf.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.pogodaev.movinf.entities.UserProfile;

@RestController
@RequestMapping("/user")
public class SecuredUserController {
    @GetMapping("/logout")
    public void logout() {

    }

    @GetMapping("/current")
    public void currentUser() {

    }
}
