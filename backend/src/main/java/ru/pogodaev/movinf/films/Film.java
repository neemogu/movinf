package ru.pogodaev.movinf.films;

import com.fasterxml.jackson.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import ru.pogodaev.movinf.actors.Actor;
import ru.pogodaev.movinf.categories.Category;
import ru.pogodaev.movinf.countries.Country;
import ru.pogodaev.movinf.languages.Language;
import ru.pogodaev.movinf.persons.Person;
import ru.pogodaev.movinf.reviews.Review;
import ru.pogodaev.movinf.studios.Studio;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@Entity
@EqualsAndHashCode(exclude = {"reviews"})
@ToString(exclude = {"reviews"})
@Table(name = "films")
@NoArgsConstructor
public class Film {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @NotNull(message = "Enter film title")
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

    @Size(max = 100, message = "Film tagline length must be up to 100")
    @Column(name = "tagline")
    private String tagline;

    @ManyToOne(targetEntity = Language.class)
    @JoinColumn(name = "language_id")
    @JsonIgnoreProperties(value = {"films"})
    private Language language;

    @Column(name = "budget")
    @Min(value = 1, message = "Budget must be positive number")
    private Long budget;
    @Column(name = "box_office")
    @Min(value = 1, message = "Box office must be positive number")
    private Long boxOffice;
    @NotNull(message = "Enter duration (in minutes)")
    @Column(name = "duration")
    @Min(value = 1, message = "Duration must be positive (in minutes)")
    private Integer minutesDuration;

    @NotNull(message = "Enter age rating")
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "age_rating")
    private AgeRating ageRating;

    @Column(name = "rating", updatable = false, insertable = false)
    private Float rating;

    @ManyToMany(targetEntity = Country.class)
    @JoinTable(name = "film_country",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "country_id"))
    @JsonIgnoreProperties(value = {"films", "persons"})
    private Set<Country> countries;

    @ManyToMany(targetEntity = Studio.class)
    @JoinTable(
            name = "film_studio",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "studio_id")
    )
    @JsonIgnoreProperties(value = {"films"})
    private Set<Studio> studios;

    @ManyToMany(targetEntity = Category.class)
    @JoinTable(
            name = "film_category",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @JsonIgnoreProperties(value = {"films"})
    private Set<Category> categories;

    @OneToMany(mappedBy = "film", fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"film"})
    @Valid
    private List<Actor> actors;

    @ManyToMany(targetEntity = Person.class)
    @JoinTable(
            name = "scenarists",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    @JsonIgnoreProperties(value = {"asActorFilms", "asProducerFilms", "asScenaristFilms", "asDirectorFilms"})
    private Set<Person> scenarists;

    @ManyToMany(targetEntity = Person.class)
    @JoinTable(
            name = "directors",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    @JsonIgnoreProperties(value = {"asActorFilms", "asProducerFilms", "asScenaristFilms", "asDirectorFilms"})
    private Set<Person> directors;

    @ManyToMany(targetEntity = Person.class)
    @JoinTable(
            name = "producers",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    @JsonIgnoreProperties(value = {"asActorFilms", "asProducerFilms", "asScenaristFilms", "asDirectorFilms"})
    private Set<Person> producers;

    @OneToMany(mappedBy = "id.film")
    @JsonIgnore
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

        public static AgeRating fromStrValue(String value) {
            switch (value) {
                case "0+":
                    return ZERO_PLUS;
                case "6+":
                    return SIX_PLUS;
                case "12+":
                    return TWELVE_PLUS;
                case "16+":
                    return SIXTEEN_PLUS;
                case "18+":
                default:
                    return EIGHTEEN_PLUS;
            }
        }
        @JsonValue
        public String getStrValue() {
            return strValue;
        }
    }


}
