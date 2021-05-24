package ru.pogodaev.movinf.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import ru.pogodaev.movinf.users.User;

@Data
@AllArgsConstructor
public class LoginData {
    private User user;
    private String token;
}
