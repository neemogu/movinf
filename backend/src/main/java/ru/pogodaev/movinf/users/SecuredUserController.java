package ru.pogodaev.movinf.users;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class SecuredUserController {
    @GetMapping("/logout")
    public boolean logout() {
        return true;
    }

    @GetMapping("/current")
    public User currentUser() {
        return null;
    }
}
