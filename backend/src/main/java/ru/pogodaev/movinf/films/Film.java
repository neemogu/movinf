package ru.pogodaev.movinf.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;
import lombok.Getter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "films")
public class Film {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;
    @NotNull
    @Size(min = 1, max = 200, message = "Film title length must be from 1 to 200")
    @Column(name = "title")
    private String title;

    @Size(max = 500, message = "Short description length must be up to 500")
    @Column(name = "short_description")
    private String shortDescription;
    @Size(max = 3000, message = "Short description length must be up to 3000")
    @Column(name = "full_description")
    private String fullDescription;

    @JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING)
    @Column(name = "production_date")
    private Date productionDate;

    @Size(min = 1, max = 100, message = "Film tagline length must be from 1 to 100")
    @Column(name = "tagline")
    private String tagline;

    @ManyToOne(targetEntity = Language.class)
    @JoinColumn(name = "language_id")
    private Language language;

    @Column(name = "budget")
    private long budget;
    @Column(name = "box_office")
    private long boxOffice;
    @NotNull
    @Column(name = "duration")
    private int minutesDuration;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "age_rating")
    private AgeRating ageRating;

    @Column(name = "rating")
    private Float rating;

    @ManyToMany(targetEntity = Country.class)
    @JoinTable(name = "film_country",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "country_id"))
    private List<Country> countries;

    @ManyToMany(targetEntity = Studio.class)
    @JoinTable(
            name = "film_studio",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "studio_id")
    )
    private List<Studio> studios;

    @ManyToMany(targetEntity = Category.class)
    @JoinTable(
            name = "film_category",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;

    @OneToMany(mappedBy = "film")
    private List<Actor> actors;
    @ManyToMany(mappedBy = "asScenaristFilms")
    private List<Person> scenarists;
    @ManyToMany(mappedBy = "asDirectorFilms")
    private List<Person> directors;
    @ManyToMany(mappedBy = "asProducerFilms")
    private List<Person> producers;

    @OneToMany(mappedBy = "id.film")
    private List<Review> reviews;

    public enum AgeRating {
        ZERO_PLUS("0+"),
        SIX_PLUS("6+"),
        TWELVE_PLUS("12+"),
        SIXTEEN_PLUS("16+"),
        EIGHTEEN_PLUS("18+");

        private final String strValue;

        private AgeRating(String strValue) {
            this.strValue = strValue;
        }

        @JsonValue
        public String getStrValue() {
            return strValue;
        }
    }

}
