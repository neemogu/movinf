package ru.pogodaev.movinf.users;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class SecuredUserController {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Autowired
    public SecuredUserController(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @GetMapping("/logout")
    public boolean logout() {
        return true;
    }

    @GetMapping("/current")
    public User currentUser() {
        return null;
    }

    @PutMapping
    public ResponseEntity<String> editUser(@RequestBody @Valid User user) {
        Optional<User> foundUser = userRepository.findById(user.getId());
        if (foundUser.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!user.getPassword().equals("")) {
            user.setPassword(foundUser.get().getPassword());
        } else {
            user.setPassword(encoder.encode(user.getPassword()));
        }
        userRepository.save(user);
        return ResponseEntity.ok("Success");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(
            DataIntegrityViolationException exception) {
        return new ResponseEntity<>("Username or email is already exist", HttpStatus.CONFLICT);
    }
}
