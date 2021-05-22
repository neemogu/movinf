package ru.pogodaev.movinf.users;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UsersController {
    private final UserService service;

    public UsersController(UserService service) {
        this.service = service;
    }

    @GetMapping("/all/{pageNum}")
    public Iterable<User> getPagedList(@PathVariable("pageNum") Integer page,
                                       @RequestParam(name = "pageSize", defaultValue = "5") Integer pageSize,
                                       @RequestParam(name = "sortBy", defaultValue = "title") String sortBy,
                                       @RequestParam(name = "sortDirection") Optional<String> sortDir,
                                       @RequestParam(name = "username", defaultValue = "") String username,
                                       @RequestParam(name = "firstname", defaultValue = "") String firstname,
                                       @RequestParam(name = "lastname", defaultValue = "") String lastname,
                                       @RequestParam(name = "email", defaultValue = "") String email,
                                       @RequestParam(name = "birthdateFrom", defaultValue = "1900-01-01")
                                           @DateTimeFormat(pattern="yyyy-MM-dd") Date birthdateFrom,
                                       @RequestParam(name = "birthdateTo", defaultValue = "2100-01-01")
                                           @DateTimeFormat(pattern="yyyy-MM-dd") Date birthdateTo,
                                       @RequestParam(name = "gender") Optional<String> gender,
                                       @RequestParam(name = "regDateFrom", defaultValue = "1900-01-01")
                                           @DateTimeFormat(pattern="yyyy-MM-dd") Date regDateFrom,
                                       @RequestParam(name = "regDateTo", defaultValue = "2100-01-01")
                                           @DateTimeFormat(pattern="yyyy-MM-dd") Date regDateTo) {
        return service.getPagedList(page, pageSize, sortBy, sortDir, username, firstname, lastname, email,
                birthdateFrom, birthdateTo, gender, regDateFrom, regDateTo);
    }

    @GetMapping("/all/pages")
    public Long pageCount(@RequestParam(name = "pageSize", defaultValue = "5") Integer pageSize,
                             @RequestParam(name = "username", defaultValue = "") String username,
                             @RequestParam(name = "firstname", defaultValue = "") String firstname,
                             @RequestParam(name = "lastname", defaultValue = "") String lastname,
                             @RequestParam(name = "email", defaultValue = "") String email,
                             @RequestParam(name = "birthdateFrom", defaultValue = "1900-01-01")
                                 @DateTimeFormat(pattern="yyyy-MM-dd") Date birthdateFrom,
                             @RequestParam(name = "birthdateTo", defaultValue = "2100-01-01")
                                 @DateTimeFormat(pattern="yyyy-MM-dd") Date birthdateTo,
                             @RequestParam(name = "gender") Optional<String> gender,
                             @RequestParam(name = "regDateFrom", defaultValue = "1900-01-01")
                                 @DateTimeFormat(pattern="yyyy-MM-dd") Date regDateFrom,
                             @RequestParam(name = "regDateTo", defaultValue = "2100-01-01")
                                 @DateTimeFormat(pattern="yyyy-MM-dd") Date regDateTo) {
        return service.pageCount(pageSize, username, firstname, lastname, email,
                birthdateFrom, birthdateTo, gender, regDateFrom, regDateTo);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getSpecificUser(@PathVariable Long userId) {
        User foundUser = service.getUserById(userId);
        if (foundUser != null) {
            return ResponseEntity.ok(foundUser);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/genders-list")
    public Iterable<User.Gender> getGendersList() {
        return Arrays.asList(User.Gender.values());
    }
}
