package ru.pogodaev.movinf;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @CrossOrigin("*")
    @GetMapping("/")
    public String homePageMessage() {
        System.out.println("return hello message");
        return "Hello world!";
    }

}
