package ru.pogodaev.movinf.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.pogodaev.movinf.users.User;
import ru.pogodaev.movinf.users.UserRepository;

import java.util.Optional;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public JwtUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> foundUser = userRepository.findByUsername(username);
        if (foundUser.isPresent()) {
            return foundUser.get();
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}
