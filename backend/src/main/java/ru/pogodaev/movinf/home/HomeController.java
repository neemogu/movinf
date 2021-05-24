package ru.pogodaev.movinf.home;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {
    @GetMapping
    public Map<String, Map<String, String>> getHomePage() {
        Map<String, String> links = new HashMap<>();
        links.put("categories", "/categories");
        links.put("countries", "/countries");
        links.put("films", "/films");
        links.put("languages", "/languages");
        links.put("persons", "/persons");
        links.put("reviews", "/reviews");
        links.put("studios", "/studios");
        links.put("profiles", "/users");
        links.put("login", "/auth/login");
        links.put("register", "/auth/register");
        links.put("currentUser", "/user/current");
        Map<String, Map<String, String>> result = new HashMap<>();
        result.put("links", links);
        return result;
    }
}
