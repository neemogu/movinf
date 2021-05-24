package ru.pogodaev.movinf.auth;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.pogodaev.movinf.users.User;
import ru.pogodaev.movinf.users.UserRepository;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class SecuredUserController {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Autowired
    public SecuredUserController(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @GetMapping("/current")
    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User)authentication.getPrincipal();
    }

    @PutMapping
    public ResponseEntity<String> editUser(@RequestBody @Valid User user) {
        User currentUser = currentUser();
        if (!currentUser.getId().equals(user.getId()) && !currentUser.getRole().equals(User.UserRole.ADMIN)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        if (user.getPassword().equals("")) {
            user.setPassword(currentUser.getPassword());
        } else {
            user.setPassword(encoder.encode(user.getPassword()));
        }
        user.setRegistrationDate(currentUser.getRegistrationDate());
        userRepository.save(user);
        return ResponseEntity.ok("Success");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(
            DataIntegrityViolationException exception) {
        return new ResponseEntity<>("Username or email is already exist", HttpStatus.CONFLICT);
    }
}
