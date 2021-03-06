package ru.pogodaev.movinf.users;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
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
@NoArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull(message = "Enter username")
    @Size(min = 5, max = 30, message = "Username must be from 5 to 30 characters long")
    @Column(name = "username")
    private String username;

    @NotNull(message = "Enter a password")
    @Column(name = "password")
    private String password;

    @Size(max = 50, message = "Firstname must be up to 50 characters")
    @Column(name = "firstname")
    private String firstname;

    @Size(max = 50, message = "Lastname must be up to 50 characters")
    @Column(name = "lastname")
    private String lastname;

    @Column(name = "birthdate")
    @JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING)
    private Date birthdate;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new LinkedList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.strValue));
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public enum Gender {
        MALE("Male"),
        FEMALE("Female");

        private final String strValue;

        Gender(String strValue) {
            this.strValue = strValue;
        }

        public static Gender fromStrValue(String value) {
            switch (value) {
                case "Male":
                    return MALE;
                case "Female":
                default:
                    return FEMALE;
            }
        }
        @JsonValue
        public String getStrValue() {
            return strValue;
        }
    }

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "gender")
    @NotNull(message = "Enter your gender")
    private Gender gender;

    @NotNull(message = "Enter your email")
    @Size(max = 100, message = "Wrong email size, must be up to 100")
    @Email(message = "Wrong email format")
    @Column(name = "email")
    private String email;

    @Column(name = "registration_date")
    @JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING, timezone = "Asia/Novosibirsk")
    private Date registrationDate;

    @PrePersist
    public void registrationDate() {
        registrationDate = new Date();
    }

    @OneToMany(mappedBy = "id.user")
    @JsonIgnore
    private List<Review> reviews;

    public enum UserRole {
        USER("USER"),
        ADMIN("ADMIN");

        private final String strValue;

        UserRole(String strValue) {
            this.strValue = strValue;
        }

        @JsonValue
        public String getStrValue() {
            return strValue;
        }
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole role = UserRole.USER;
}
