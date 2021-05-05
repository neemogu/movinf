package ru.pogodaev.movinf.userprofiles;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.users.User;

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UsersController {
    private final UserService service;

    public UsersController(UserService service) {
        this.service = service;
    }

    @GetMapping("/all/{pageNum}")
    public Iterable<User> getPagedList(@PathVariable("pageNum") Optional<Integer> page,
                                              @RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize,
                                              @RequestParam(name = "sortBy", defaultValue = "users.username") String sortBy) {
        return service.getPagedList(page, pageSize, sortBy);
    }

    @GetMapping("/all/pages")
    public Integer pageCount(@RequestParam(name = "pageSize", defaultValue = "20") Integer pageSize) {
        return service.pageCount(pageSize);
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<UserProfile> getSpecificUser(@PathVariable Long userId) {
        UserProfile foundUser = service.getSpecificUser(userId);
        if (foundUser != null) {
            return ResponseEntity.ok(foundUser);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/name/{username}")
    public ResponseEntity<UserProfile> getSpecificUser(@PathVariable String username) {
        UserProfile foundUser = service.getSpecificUser(username);
        if (foundUser != null) {
            return ResponseEntity.ok(foundUser);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/genders-list")
    public Iterable<UserProfile.Gender> getGendersList() {
        return Arrays.asList(UserProfile.Gender.values());
    }
}
