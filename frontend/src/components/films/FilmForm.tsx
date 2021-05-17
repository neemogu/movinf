import React from "react";
import {
    Button, MenuItem, TextField
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import {FilmPerson, getFilmPersonFromJson} from "./Film";
import "./FilmForm.css";

import {
    useParams,
    Redirect
} from "react-router-dom";

interface Id {
    id: string
}

interface SimpleProperty {
    id: string,
    name: string
}

interface FilmFormFilmData {
    id: string|null,
    title: string,
    shortDescription: string|null,
    fullDescription: string|null,
    productionDate: Date|null,
    tagline: string|null,
    language: Id|null,
    budget: string|null,
    boxOffice: string|null,
    minutesDuration: string,
    ageRating: string,
    countries: Id[],
    studios: Id[],
    categories: Id[],
    actors: {person: Id, role: string}[],
    scenarists: Id[],
    directors: Id[],
    producers: Id[]
}

interface FilmFormState {
    film : FilmFormFilmData,
    languages: SimpleProperty[],
    countries: SimpleProperty[],
    studios: SimpleProperty[],
    categories: SimpleProperty[],
    persons: FilmPerson[],
    ageRatings: string[],
    isLoaded: boolean,
    error: any,
    redirect: boolean
}

interface FilmFormProps {
    id: string|null
}

function containsPerson(person: FilmPerson, persons: Id[]) : boolean {
    var i;
    for (i = 0; i < persons.length; i++) {
        if (persons[i].id === person.id) {
            return true;
        }
    }
    return false;
}

function containsProperty(property: SimpleProperty, array: Id[]): boolean {
    var i;
    for (i = 0; i < array.length; i++) {
        if (array[i].id === property.id) {
            return true;
        }
    }
    return false;
}

function prepareFilm(film: FilmFormFilmData) : FilmFormFilmData {
    film = {
        ...film,
        countries: film.countries.filter(value => value.id !== "0"),
        categories: film.categories.filter(value => value.id !== "0"),
        studios: film.studios.filter(value => value.id !== "0"),
        directors: film.directors.filter(value => value.id !== "0"),
        scenarists: film.scenarists.filter(value => value.id !== "0"),
        producers: film.producers.filter(value => value.id !== "0"),
        actors: film.actors.filter(value => value.person.id !== "0"),
        language: film.language !== null ? (film.language.id === "0" ? null : film.language) : film.language
    }
    return film
}

class FilmForm extends React.Component<FilmFormProps, FilmFormState>{
    constructor(props: FilmFormProps) {
        super(props);
        this.state = {
            film: {
                id: this.props.id,
                title: '',
                shortDescription: '',
                fullDescription: '',
                productionDate: new Date(),
                tagline: '',
                language: {id: "0"},
                budget: '0',
                boxOffice: '0',
                minutesDuration: '1',
                ageRating: '18+',
                countries: [{id: "0"}],
                studios: [{id: "0"}],
                categories: [{id: "0"}],
                actors: [{person: {id: "0"}, role: ''}],
                scenarists: [{id: "0"}],
                directors: [{id: "0"}],
                producers: [{id: "0"}]
            },
            languages: [],
            countries: [],
            studios: [],
            categories: [],
            persons: [],
            ageRatings: [],
            isLoaded: false,
            error: {},
            redirect: false
        }
        this.bindHandles = this.bindHandles.bind(this);
        this.bindHandles();
    }

    bindHandles() {
        this.deleteItem = this.deleteItem.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleActorRoleChange = this.handleActorRoleChange.bind(this);
        this.handleActorPersonChange = this.handleActorPersonChange.bind(this);
        this.handleAddActor = this.handleAddActor.bind(this);
        this.handleDirectorChange = this.handleDirectorChange.bind(this);
        this.handleAddDirector = this.handleAddDirector.bind(this);
        this.handleProducerChange = this.handleProducerChange.bind(this);
        this.handleAddProducer = this.handleAddProducer.bind(this);
        this.handleScenaristChange = this.handleScenaristChange.bind(this);
        this.handleAddScenarist = this.handleAddScenarist.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleAddCategory = this.handleAddCategory.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleAddCountry = this.handleAddCountry.bind(this);
        this.handleStudioChange = this.handleStudioChange.bind(this);
        this.handleAddStudio = this.handleAddStudio.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleRemoveActor = this.handleRemoveActor.bind(this);
        this.handleRemoveDirector = this.handleRemoveDirector.bind(this);
        this.handleRemoveScenarist = this.handleRemoveScenarist.bind(this);
        this.handleRemoveProducer = this.handleRemoveProducer.bind(this);
        this.handleRemoveCountry = this.handleRemoveCountry.bind(this);
        this.handleRemoveStudio = this.handleRemoveStudio.bind(this);
        this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
        this.handleShortDescChange = this.handleShortDescChange.bind(this);
        this.handleFullDescChange = this.handleFullDescChange.bind(this);
        this.handleProductionDateChange = this.handleProductionDateChange.bind(this);
        this.handleTaglineChange = this.handleTaglineChange.bind(this);
        this.handleBudgetChange = this.handleBudgetChange.bind(this);
        this.handleBoxOfficeChange = this.handleBoxOfficeChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleAgeRatingChange = this.handleAgeRatingChange.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:8080/persons")
            .then(response => response.json())
            .then(data => this.setState({persons: data.list}))
        fetch("http://localhost:8080/categories")
            .then(response => response.json())
            .then(data => this.setState({categories: data.list}))
        fetch("http://localhost:8080/studios")
            .then(response => response.json())
            .then(data => this.setState({studios: data.list}))
        fetch("http://localhost:8080/countries")
            .then(response => response.json())
            .then(data => this.setState({countries: data.list}))
        fetch("http://localhost:8080/languages")
            .then(response => response.json())
            .then(data => this.setState({languages: data.list}))
        fetch("http://localhost:8080/films/age-ratings")
            .then(response => response.json())
            .then(data => this.setState({ageRatings: data}))
        if (this.state.film.id !== null) {
            fetch("http://localhost:8080/films/" + this.state.film.id)
                .then(response => response.json())
                .then(data => this.setState({film: {
                        id: data.id,
                        title: data.title,
                        shortDescription: data.shortDescription,
                        fullDescription: data.fullDescription,
                        productionDate: new Date(data.productionDate),
                        tagline: data.tagline,
                        language: data.language !== null ? data.language: {id: "0"},
                        budget: data.budget,
                        boxOffice: data.boxOffice,
                        minutesDuration: data.minutesDuration,
                        ageRating: data.ageRating,
                        countries: data.countries,
                        studios: data.studios,
                        categories: data.categories,
                        actors: data.actors.map(function (actor: any) {
                            return {
                                id: actor.id,
                                person: getFilmPersonFromJson(actor.person),
                                role: actor.role
                            }
                        }),
                        scenarists: data.scenarists.map(getFilmPersonFromJson),
                        directors: data.directors.map(getFilmPersonFromJson),
                        producers: data.producers.map(getFilmPersonFromJson),
                    }}))
        }
        this.setState({isLoaded: true});
    }

    submitForm() {
        let preparedFilm = prepareFilm(JSON.parse(JSON.stringify(this.state.film)));
        console.log(preparedFilm);
        const requestOptions = {
            method: preparedFilm.id === null ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preparedFilm)
        };
        fetch('http://localhost:8080/films', requestOptions)
            .then(response => {
                if (response.ok) {
                    this.setState({redirect: true});
                } else {
                    window.scrollTo(0, 0);
                }
                return response.json();
            })
            .then(errors => {
                this.setState({error: errors});
                console.log(errors);
            });
    }

    deleteItem() {
        const requestOptions = {
            method: 'DELETE'
        };
        fetch('http://localhost:8080/films/' + this.state.film.id, requestOptions)
            .then(response => response.json());
        this.setState({redirect: true});
    }

    handleActorPersonChange(event: any) {
        let newActors = this.state.film.actors.concat();
        newActors[parseInt(event.target.name)].person = {id: event.target.value};
        this.setState(prevState => ({film: { ...prevState.film, actors: newActors }}));
    };

    handleActorRoleChange(event: any) {
        let newActors = this.state.film.actors.concat();
        newActors[parseInt(event.target.name)].role = event.target.value;
        this.setState(prevState => ({film: { ...prevState.film, actors: newActors }}));
    };

    handleAddActor(event: any) {
        let newActors = this.state.film.actors.concat({person: {id: "0"}, role: ""});
        this.setState(prevState => ({film: { ...prevState.film, actors: newActors }}));
    }

    handleRemoveActor(event: any) {
        let newActors = this.state.film.actors.concat();
        newActors.splice(parseInt(event.currentTarget.name), 1);
        this.setState(prevState => ({film: { ...prevState.film, actors: newActors }}));
    }

    handleDirectorChange(event: any) {
        let newDirectors = this.state.film.directors.concat();
        newDirectors[parseInt(event.target.name)] = {id: event.target.value};
        this.setState(prevState => ({film: { ...prevState.film, directors: newDirectors }}));
    };

    handleAddDirector(event: any) {
        let newDirectors = this.state.film.directors.concat({id: "0"});
        this.setState(prevState => ({film: { ...prevState.film, directors: newDirectors }}));
    }

    handleRemoveDirector(event: any) {
        let newDirectors= this.state.film.directors.concat();
        newDirectors.splice(parseInt(event.currentTarget.name), 1);
        this.setState(prevState => ({film: { ...prevState.film, directors: newDirectors }}));
    }

    handleProducerChange(event: any) {
        let newProducers = this.state.film.producers.concat();
        newProducers[parseInt(event.target.name)] = {id: event.target.value};
        this.setState(prevState => ({film: { ...prevState.film, producers: newProducers }}));
    };

    handleAddProducer(event: any) {
        let newProducers = this.state.film.producers.concat({id: "0"});
        this.setState(prevState => ({film: { ...prevState.film, producers: newProducers }}));
    }

    handleRemoveProducer(event: any) {
        let newProducers= this.state.film.producers.concat();
        newProducers.splice(parseInt(event.currentTarget.name), 1);
        this.setState(prevState => ({film: { ...prevState.film, producers: newProducers }}));
    }

    handleScenaristChange(event: any) {
        let newScenarists = this.state.film.scenarists.concat();
        newScenarists[parseInt(event.target.name)] = {id: event.target.value};
        this.setState(prevState => ({film: { ...prevState.film, scenarists: newScenarists }}));
    };

    handleAddScenarist(event: any) {
        let newScenarists = this.state.film.scenarists.concat({id: "0"});
        this.setState(prevState => ({film: { ...prevState.film, scenarists: newScenarists }}));
    }

    handleRemoveScenarist(event: any) {
        let newScenarists= this.state.film.scenarists.concat();
        newScenarists.splice(parseInt(event.currentTarget.name), 1);
        this.setState(prevState => ({film: { ...prevState.film, scenarists: newScenarists }}));
    }

    handleCategoryChange(event: any) {
        let newCategories = this.state.film.categories.concat();
        newCategories[parseInt(event.target.name)] = {id: event.target.value};
        this.setState(prevState => ({film: { ...prevState.film, categories: newCategories }}));
    };

    handleAddCategory(event: any) {
        let newCategories = this.state.film.categories.concat({id: "0"});
        this.setState(prevState => ({film: { ...prevState.film, categories: newCategories }}));
    }

    handleRemoveCategory(event: any) {
        let newCategories= this.state.film.categories.concat();
        newCategories.splice(parseInt(event.currentTarget.name), 1);
        this.setState(prevState => ({film: { ...prevState.film, categories: newCategories }}));
    }

    handleStudioChange(event: any) {
        let newStudios = this.state.film.studios.concat();
        newStudios[parseInt(event.target.name)] = {id: event.target.value};
        this.setState(prevState => ({film: { ...prevState.film, studios: newStudios }}));
    };

    handleAddStudio(event: any) {
        let newStudios = this.state.film.studios.concat({id: "0"});
        this.setState(prevState => ({film: { ...prevState.film, studios: newStudios }}));
    }

    handleRemoveStudio(event: any) {
        let newStudios= this.state.film.studios.concat();
        newStudios.splice(parseInt(event.currentTarget.name), 1);
        this.setState(prevState => ({film: { ...prevState.film, studios: newStudios }}));
    }

    handleCountryChange(event: any) {
        let newCountries = this.state.film.countries.concat();
        newCountries[parseInt(event.target.name)] = {id: event.target.value};
        this.setState(prevState => ({film: { ...prevState.film, countries: newCountries }}));
    };

    handleAddCountry(event: any) {
        let newCountries = this.state.film.countries.concat({id: "0"});
        this.setState(prevState => ({film: { ...prevState.film, countries: newCountries }}));
    }

    handleRemoveCountry(event: any) {
        let newCountries= this.state.film.countries.concat();
        newCountries.splice(parseInt(event.currentTarget.name), 1);
        this.setState(prevState => ({film: { ...prevState.film, countries: newCountries }}));
    }

    handleLanguageChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, language: {id: event.target.value} }}));
    };

    handleTitleChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, title: event.target.value }}));
    }

    handleShortDescChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, shortDescription: event.target.value }}));
    }

    handleFullDescChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, fullDescription: event.target.value }}));
    }

    handleProductionDateChange(date: any) {
        this.setState(prevState => ({film: { ...prevState.film, productionDate: date }}));
    }

    handleTaglineChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, tagline: event.target.value }}));
    }

    handleBudgetChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, budget: event.target.value }}));
    }

    handleBoxOfficeChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, boxOffice: event.target.value }}));
    }

    handleDurationChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, minutesDuration: event.target.value }}));
    }

    handleAgeRatingChange(event: any) {
        this.setState(prevState => ({film: { ...prevState.film, ageRating: event.target.value }}));
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/films"/>
        }
        if (!this.state.isLoaded) {
            return (<h1>Loading</h1>);
        }
        return (
           <form className="film-form">
               <div className="form-text-field-container">
                   <span className="form-property-title">Title</span>
                   <div className="form-text-field">
                       <TextField label="Title"
                                  required
                                  multiline
                                  variant="outlined"
                                  value={this.state.film.title}
                                  onChange={this.handleTitleChange}
                                  size="small"
                                  error={this.state.error.title !== undefined}
                                  helperText={this.state.error.title !== undefined ? this.state.error.title : ""}
                       />
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Short description</span>
                   <div className="form-text-field">
                       <TextField label="Short description"
                                  multiline
                                  variant="outlined"
                                  value={this.state.film.shortDescription === null ? "" : this.state.film.shortDescription}
                                  onChange={this.handleShortDescChange}
                                  size="small"
                                  error={this.state.error.shortDescription !== undefined}
                                  helperText={this.state.error.shortDescription !== undefined ? this.state.error.shortDescription : ""}
                       />
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Full Description</span>
                   <div className="form-text-field">
                       <TextField label="Full description"
                                  multiline
                                  variant="outlined"
                                  value={this.state.film.fullDescription === null ? "" : this.state.film.fullDescription}
                                  onChange={this.handleFullDescChange}
                                  error={this.state.error.fullDescription !== undefined}
                                  helperText={this.state.error.fullDescription !== undefined ? this.state.error.fullDescription : ""}
                       />
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Production date</span>
                   <div className="form-text-field">
                       <MuiPickersUtilsProvider utils={DateFnsUtils}>
                           <KeyboardDatePicker
                               variant="inline"
                               inputVariant="outlined"
                               clearable
                               value={this.state.film.productionDate === null ? new Date() : this.state.film.productionDate}
                               placeholder="01/01/2021"
                               onChange={date => this.handleProductionDateChange(date)}
                               format="dd/MM/yyyy"
                               autoOk
                               InputAdornmentProps={{ position: "start" }}
                               size="small"
                               error={this.state.error.productionDate !== undefined}
                               helperText={this.state.error.productionDate !== undefined ? this.state.error.productionDate : ""}
                           />
                       </MuiPickersUtilsProvider>
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Tagline</span>
                   <div className="form-text-field">
                       <TextField label="Tagline"
                                  multiline
                                  variant="outlined"
                                  value={this.state.film.tagline === null ? "" : this.state.film.tagline}
                                  onChange={this.handleTaglineChange}
                                  size="small"
                                  error={this.state.error.tagline !== undefined}
                                  helperText={this.state.error.tagline !== undefined ? this.state.error.tagline : ""}
                       />
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Budget</span>
                   <div className="form-text-field">
                       <TextField label="Budget"
                                  type="number"
                                  InputLabelProps={{
                                      shrink: true,
                                  }}
                                  inputProps={{
                                      step: 1000,
                                      min: 0
                                  }}
                                  variant="outlined"
                                  value={this.state.film.budget === null ? "0" : this.state.film.budget}
                                  onChange={this.handleBudgetChange}
                                  size="small"
                                  error={this.state.error.budget !== undefined}
                                  helperText={this.state.error.budget !== undefined ? this.state.error.budget : ""}
                       />
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Box office</span>
                   <div className="form-text-field">
                       <TextField label="Box office"
                                  type="number"
                                  InputLabelProps={{
                                      shrink: true,
                                  }}
                                  inputProps={{
                                      step: 1000,
                                      min: 0
                                  }}
                                  variant="outlined"
                                  value={this.state.film.boxOffice === null ? "0" : this.state.film.boxOffice}
                                  onChange={this.handleBoxOfficeChange}
                                  size="small"
                                  error={this.state.error.boxOffice !== undefined}
                                  helperText={this.state.error.boxOffice !== undefined ? this.state.error.boxOffice : ""}
                       />
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Duration</span>
                   <div className="form-text-field">
                       <TextField label="Minutes"
                                  type="number"
                                  required
                                  InputLabelProps={{
                                      shrink: true,
                                  }}
                                  inputProps={{
                                      step: 1,
                                      min: 1
                                  }}
                                  variant="outlined"
                                  value={this.state.film.minutesDuration}
                                  onChange={this.handleDurationChange}
                                  size="small"
                                  error={this.state.error.minutesDuration !== undefined}
                                  helperText={this.state.error.minutesDuration !== undefined ? this.state.error.minutesDuration : ""}
                       />
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Age rating</span>
                   <div className="form-text-field">
                       <TextField select
                                  label="Age rating"
                                  variant="outlined"
                                  value={this.state.film.ageRating}
                                  onChange={this.handleAgeRatingChange}
                                  size="small"
                       >
                           {this.state.ageRatings
                               .map(ageRating => (
                                   <MenuItem key={ageRating} value={ageRating}>
                                       {ageRating}
                                   </MenuItem>
                               ))}
                       </TextField>
                   </div>
               </div>
               <div className="form-text-field-container">
                   <span className="form-property-title">Language</span>
                   <div className="form-text-field">
                       <TextField select
                                  label="Language"
                                  variant="outlined"
                                  value={this.state.film.language === null ? "0" : this.state.film.language.id}
                                  onChange={this.handleLanguageChange}
                                  size="small"
                       >
                           <MenuItem disabled value={"0"}>None</MenuItem>
                           {this.state.languages
                               .map(language => (
                                   <MenuItem key={language.id} value={language.id}>
                                       {language.name}
                                   </MenuItem>
                               ))}
                       </TextField>
                   </div>
               </div>
               <div className="film-form-block">
                   <h3>Categories</h3>
                   {this.state.film.categories.map((category, idx) => (
                       <div key={idx.toString()} className="form-text-field-container">
                           <div className="form-text-field">
                               <TextField select
                                          label="Category"
                                          variant="outlined"
                                          value={category.id}
                                          name={idx.toString()}
                                          onChange={this.handleCategoryChange}
                                          size="small"
                               >
                                   <MenuItem disabled value={"0"}>None</MenuItem>
                                   {this.state.categories
                                       .map(category => (
                                           <MenuItem key={category.id} value={category.id}
                                                     disabled={containsProperty(category, this.state.film.categories)}>
                                               {category.name}
                                           </MenuItem>
                                       ))}
                               </TextField>
                               <Button name={idx.toString()} onClick={this.handleRemoveCategory}>Remove</Button>
                           </div>
                       </div>
                   ))}
                   <Button onClick={this.handleAddCategory}>Add category</Button>
               </div>
               <div className="film-form-block">
                   <h3>Studios</h3>
                   {this.state.film.studios.map((studio, idx) => (
                       <div key={idx.toString()} className="form-text-field-container">
                           <div className="form-text-field">
                               <TextField select
                                          label="Studio"
                                          variant="outlined"
                                          value={studio.id}
                                          name={idx.toString()}
                                          onChange={this.handleStudioChange}
                                          size="small"
                               >
                                   <MenuItem disabled value={"0"}>None</MenuItem>
                                   {this.state.studios
                                       .map(studio => (
                                           <MenuItem key={studio.id} value={studio.id}
                                                     disabled={containsProperty(studio, this.state.film.studios)}>
                                               {studio.name}
                                           </MenuItem>
                                       ))}
                               </TextField>
                               <Button name={idx.toString()} onClick={this.handleRemoveStudio}>Remove</Button>
                           </div>
                       </div>
                   ))}
                   <Button onClick={this.handleAddStudio}>Add studio</Button>
               </div>
               <div className="film-form-block">
                   <h3>Countries</h3>
                   {this.state.film.countries.map((country, idx) => (
                       <div key={idx.toString()} className="form-text-field-container">
                           <div className="form-text-field">
                               <TextField select
                                          label="Country"
                                          variant="outlined"
                                          value={country.id}
                                          name={idx.toString()}
                                          onChange={this.handleCountryChange}
                                          size="small"
                               >
                                   <MenuItem disabled value={"0"}>None</MenuItem>
                                   {this.state.countries
                                       .map(country => (
                                           <MenuItem key={country.id} value={country.id}
                                                     disabled={containsProperty(country, this.state.film.countries)}>
                                               {country.name}
                                           </MenuItem>
                                       ))}
                               </TextField>
                               <Button name={idx.toString()} onClick={this.handleRemoveCountry}>Remove</Button>
                           </div>
                       </div>
                   ))}
                   <Button onClick={this.handleAddCountry}>Add country</Button>
               </div>
               <div className="film-form-block">
                   <h3>Actors</h3>
                   {this.state.film.actors.map((actor, idx) => (
                       <div key={idx.toString()} className="form-text-field-container">
                           <div className="form-text-field">
                                <TextField select
                                           label="Person"
                                           variant="outlined"
                                           value={actor.person.id}
                                           name={idx.toString()}
                                           onChange={this.handleActorPersonChange}
                                           size="small"
                                >
                                    <MenuItem disabled value={"0"}>None</MenuItem>
                                    {this.state.persons.map(person => (
                                        <MenuItem key={person.id} value={person.id}>
                                            {person.firstname + " " + (person.lastname !== null ? person.lastname : "")}
                                        </MenuItem>
                                    ))}
                                </TextField>
                           </div>
                           <div className="form-text-field">
                                <TextField required
                                           label="Role"
                                           variant="outlined"
                                           value={actor.role}
                                           name={idx.toString()}
                                           onChange={this.handleActorRoleChange}
                                           size="small"
                                           error={this.state.error["actors[" + idx + "].role"] !== undefined}
                                           helperText={this.state.error["actors[" + idx + "].role"] !== undefined ?
                                               this.state.error["actors[" + idx + "].role"] : ""}
                                />
                           </div>
                           <Button name={idx.toString()} onClick={this.handleRemoveActor}>Remove</Button>
                       </div>
                   ))}
                   <Button onClick={this.handleAddActor}>Add actor</Button>
               </div>
               <div className="film-form-block">
                   <h3>Directors</h3>
                   {this.state.film.directors.map((director, idx) => (
                       <div key={idx.toString()} className="form-text-field-container">
                           <div className="form-text-field">
                               <TextField select
                                          label="Person"
                                          variant="outlined"
                                          value={director.id}
                                          name={idx.toString()}
                                          onChange={this.handleDirectorChange}
                                          size="small"
                               >
                                   <MenuItem disabled value={"0"}>None</MenuItem>
                                   {this.state.persons
                                       .map(person => (
                                       <MenuItem key={person.id} value={person.id} disabled={containsPerson(person, this.state.film.directors)}>
                                           {person.firstname + " " + (person.lastname !== null ? person.lastname : "")}
                                       </MenuItem>
                                   ))}
                               </TextField>
                               <Button name={idx.toString()} onClick={this.handleRemoveDirector}>Remove</Button>
                           </div>
                       </div>
                   ))}
                   <Button onClick={this.handleAddDirector}>Add director</Button>
               </div>
               <div className="film-form-block">
                   <h3>Producers</h3>
                   {this.state.film.producers.map((producer, idx) => (
                       <div key={idx.toString()} className="form-text-field-container">
                           <div className="form-text-field">
                               <TextField select
                                          label="Person"
                                          variant="outlined"
                                          value={producer.id}
                                          name={idx.toString()}
                                          onChange={this.handleProducerChange}
                                          size="small"
                               >
                                   <MenuItem disabled value={"0"}>None</MenuItem>
                                   {this.state.persons
                                       .map(person => (
                                       <MenuItem key={person.id} value={person.id} disabled={containsPerson(person, this.state.film.producers)}>
                                           {person.firstname + " " + (person.lastname !== null ? person.lastname : "")}
                                       </MenuItem>
                                   ))}
                               </TextField>
                               <Button name={idx.toString()} onClick={this.handleRemoveProducer}>Remove</Button>
                           </div>
                       </div>
                   ))}
                   <Button onClick={this.handleAddProducer}>Add producer</Button>
               </div>
               <div className="film-form-block">
                   <h3>Scenarists</h3>
                   {this.state.film.scenarists.map((scenarist, idx) => (
                       <div key={idx.toString()} className="form-text-field-container">
                           <div className="form-text-field">
                               <TextField select
                                          label="Person"
                                          variant="outlined"
                                          value={scenarist.id}
                                          name={idx.toString()}
                                          onChange={this.handleScenaristChange}
                                          size="small"
                               >
                                   <MenuItem disabled value={"0"}>None</MenuItem>
                                   {this.state.persons
                                       .map(person => (
                                       <MenuItem key={person.id} value={person.id} disabled={containsPerson(person, this.state.film.scenarists)}>
                                           {person.firstname + " " + (person.lastname !== null ? person.lastname : "")}
                                       </MenuItem>
                                   ))}
                               </TextField>
                               <Button name={idx.toString()} onClick={this.handleRemoveScenarist}>Remove</Button>
                           </div>
                       </div>
                   ))}
                   <Button onClick={this.handleAddScenarist}>Add scenarist</Button>
               </div>
               <div className="film-form-submit">
                   <Button onClick={this.submitForm}>
                       Submit
                   </Button>
                   {this.state.film.id !== null ? (
                       <Button className="delete-button" onClick={this.deleteItem}>
                           Delete
                       </Button>
                   ) : <span/>}

               </div>
           </form>
        );
    }
}

function FilmFormRouteWrapper() {
    let {id} = useParams();
    let filmId = id === undefined ? null : id;
    console.log(filmId);
    return (
        <FilmForm id={filmId}/>
    );
}

export default FilmFormRouteWrapper;
