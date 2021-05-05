package ru.pogodaev.movinf.userprofiles;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.pogodaev.movinf.users.User;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public Iterable<User> getPagedList(Optional<Integer> page, int pageSize, String sortBy) {
        int pageNum = 0;
        if (page.isPresent()) {
            pageNum = page.get();
        }
        PageRequest pr = PageRequest.of(pageNum, pageSize, Sort.by(sortBy).descending());
        return repository.findAll(pr).getContent();
    }

    public int pageCount(int pageSize) {
        PageRequest pr = PageRequest.of(0, pageSize);
        return repository.findAll(pr).getTotalPages();
    }

    public User getUserById(long userId) {
        Optional<User> foundUser =  repository.findById(userId);
        if (foundUser.isPresent() && foundUser.get().getRole() == User.UserRole.ADMIN) {
            return null;
        }
        return foundUser.orElse(null);
    }

    public User getUserByUsername(String username) {
        Optional<User> foundUser =  repository.findByUsername(username);
        if (foundUser.isPresent() && foundUser.get().getRole() == User.UserRole.ADMIN) {
            return null;
        }
        return foundUser.orElse(null);
    }

    public User getUserByEmail(String email) {
        Optional<User> foundUser =  repository.findByEmail(email);
        if (foundUser.isPresent() && foundUser.get().getRole() == User.UserRole.ADMIN) {
            return null;
        }
        return foundUser.orElse(null);
    }
}
