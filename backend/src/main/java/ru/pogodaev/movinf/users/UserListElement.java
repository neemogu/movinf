package ru.pogodaev.movinf.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserListElement {
    private User user;
    private Long reviewsCount;
}
