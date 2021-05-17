package ru.pogodaev.movinf.users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import ru.pogodaev.movinf.reviews.Review;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.*;

@Data
@Entity
@EqualsAndHashCode(exclude = {"reviews"})
@ToString(exclude = {"reviews"})
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull(message = "Enter username")
    @Size(min = 5, max = 30, message = "Username must be from 5 to 30 characters long")
    @Column(name = "username")
    private String username;

    @NotNull(message = "Enter password")
    @Column(name = "password")
    @JsonIgnore
    private String password;

    @Size(max = 50, message = "Firstname must be up to 50 characters")
    @Column(name = "firstname")
    private String firstname;

    @Size(max = 50, message = "Lastname must be up to 50 characters")
    @Column(name = "lastname")
    private String lastname;

    @Column(name = "birthdate")
    private Date birthdate;

    public enum Gender { MALE, FEMALE }

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "gender")
    private Gender gender;

    @NotNull(message = "Enter your email")
    @Size(min = 4, max = 100, message = "Wrong email size, must be from 4 to 100")
    @Email(message = "Wrong email format")
    @Column(name = "email")
    private String email;

    @Column(name = "registration_date")
    private Date registrationDate;

    @PrePersist
    public void registrationDate() {
        registrationDate = new Date();
    }

    @OneToMany(mappedBy = "id.user", cascade = {CascadeType.REMOVE})
    @JsonIgnoreProperties(value = {"user"})
    private List<Review> reviews;

    public enum UserRole { USER, ADMIN }

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    @JsonIgnore
    private UserRole role = UserRole.USER;
}
