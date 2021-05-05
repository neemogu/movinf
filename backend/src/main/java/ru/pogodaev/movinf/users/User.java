package ru.pogodaev.movinf.entities;

import lombok.Data;
import org.springframework.security.authentication.jaas.AuthorityGranter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NotNull
    @Size(min = 5, max = 30, message = "Nickname must be from 5 to 30 characters long")
    @Column(name = "username")
    private String username;

    @NotNull
    @Column(name = "password")
    private String password;

    @OneToOne(targetEntity = UserProfile.class)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private UserProfile profile;

    public enum UserRole { USER, ADMIN }

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "role")
    private UserRole role = UserRole.USER;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.asList(new SimpleGrantedAuthority(role.name() + "_ROLE"));
    }

    @Override
    public String getUsername() {
        return username;
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
}
