import React from "react";
import {
    Pagination
} from "@material-ui/lab"
import "./FilmList.css"
import FilmList from "./FilmList";
import {FilmData} from "./FilmListElement"
import {Button, MenuItem, TextField} from "@material-ui/core";
import {Link} from "react-router-dom"
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

interface FilmListProps {}

interface FilmListState {
    films: FilmData[],
    filters: FilmFilters,
    lists: FilmFilterLists,
    pagesTotal: number,
    error: any,
    isLoaded: boolean
}

interface FilmFilters {
    title: string,
    productionDateFrom: Date,
    productionDateTo: Date,
    languageId: string,
    ageRating: string,
    categoryId: string,
    countryId: string,
    personId: string,
    ratingFrom: string,
    ratingTo: string,
    sortBy: string,
    sortDir: string
}

interface SimpleProperty {
    id: string,
    name: string
}

interface FilmFilterLists {
    languages: SimpleProperty[],
    ageRatings: string[],
    categories: SimpleProperty[],
    countries: SimpleProperty[],
    persons: {id: string, firstname: string, lastname: string}[]
}

function convertDate(date: Date) {
    return "" + date.getFullYear() + "-" +
        (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" +
        (date.getDay() + 1 >= 10 ? date.getDay() + 1 : "0" + (date.getMonth() + 1));
}

class FilterableFilmList extends React.Component<FilmListProps, FilmListState>{
    pageSize = "10";
    sortByList = [
        {name: "Title", value: "title"},
        {name: "Rating", value: "rating"},
        {name: "Production date", value: "productionDate"},
        {name: "Budget", value: "budget"},
        {name: "Box office", value: "boxOffice"},
        {name: "Duration", value: "minutesDuration"},
        {name: "Age rating", value: "ageRating"}
    ];
    sortDirList = [{name: "None", value: "-"}, {name: "Ascending", value: "asc"}, {name: "Descending", value: "desc"}]

    constructor(props: FilmListProps) {
        super(props);
        this.state = {
            films: [],
            filters: {
                title: "",
                productionDateFrom: new Date("1900-01-01"),
                productionDateTo: new Date("2100-01-01"),
                languageId: "-",
                ageRating: "-",
                categoryId: "-",
                countryId: "-",
                personId: "-",
                ratingFrom: "1",
                ratingTo: "10",
                sortBy: this.sortByList[0].value,
                sortDir: this.sortDirList[0].value
            },
            lists: {
                languages: [],
                ageRatings: [],
                categories: [],
                countries: [],
                persons: []
            },
            pagesTotal: 0,
            error: null,
            isLoaded: false
        };
        this.changePage = this.changePage.bind(this);
        this.updateList = this.updateList.bind(this);
        this.getUrlParams = this.getUrlParams.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleAgeRatingChange = this.handleAgeRatingChange.bind(this);
        this.handleProductionDateFromChange = this.handleProductionDateFromChange.bind(this);
        this.handleProductionDateToChange = this.handleProductionDateToChange.bind(this);
        this.handleRatingFromChange = this.handleRatingFromChange.bind(this);
        this.handleRatingToChange = this.handleRatingToChange.bind(this);
        this.handlePersonChange = this.handlePersonChange.bind(this);
        this.handleSortByChange = this.handleSortByChange.bind(this);
        this.handleSortDirChange = this.handleSortDirChange.bind(this);
    }

    getUrlParams() {
        return "pageSize=" + this.pageSize +
            "&title=" + this.state.filters.title +
            "&ratingFrom=" + this.state.filters.ratingFrom +
            "&ratingTo=" + this.state.filters.ratingTo +
            "&productionDateFrom=" + convertDate(this.state.filters.productionDateFrom) +
            "&productionDateTo=" + convertDate(this.state.filters.productionDateTo) +
            (this.state.filters.ageRating !== "-" ? "&ageRating=" + this.state.filters.ageRating.replace("+", "%2B") : "") +
            (this.state.filters.categoryId !== "-" ? "&categoryId=" + this.state.filters.categoryId : "") +
            (this.state.filters.countryId !== "-" ? "&countryId=" + this.state.filters.countryId : "") +
            (this.state.filters.personId !== "-" ? "&personId=" + this.state.filters.personId : "") +
            (this.state.filters.languageId !== "-" ? "&languageId=" + this.state.filters.languageId : "") +
            "&sortBy=" + this.state.filters.sortBy +
            (this.state.filters.sortDir !== "-" ? "&sortDirection=" + this.state.filters.sortDir : "");
    }

    changePage(event: object, page: number) {
        const params = this.getUrlParams();
        fetch("http://localhost:8080/films/all/" + (page - 1).toString() + "?" + params)
            .then(response => response.json())
            .then(data => this.setState({
                films: data.list.map(function (film: any) {
                    return {
                        id: film.id,
                        title: film.title,
                        shortDescription: film.shortDescription,
                        productionDate: film.productionDate,
                        language: film.language,
                        ageRating: film.ageRating,
                        rating: film.rating,
                        countries: film.countries,
                        categories: film.categories,
                        reviewsCount: film.reviewsCount
                    }
                }),
                isLoaded: true
            }), error => {
                this.setState({
                    error: error,
                    isLoaded: true
                })
            });
    }

    updateList(event: any) {
        const params = this.getUrlParams();
        fetch("http://localhost:8080/films/all/pages?" + params)
            .then(response => response.text())
            .then(data => this.setState({pagesTotal: parseInt(data)}), error => {
                this.setState({
                    error: error,
                    isLoaded: true
                })
            });
        this.changePage({}, 1)
    }

    componentDidMount() {
        fetch("http://localhost:8080/persons")
            .then(response => response.json())
            .then(data => this.setState({lists: {
                ...this.state.lists,
                persons: data.list
            }}))
        fetch("http://localhost:8080/categories")
            .then(response => response.json())
            .then(data => this.setState({lists: {
                    ...this.state.lists,
                    categories: data.list
                }}))
        fetch("http://localhost:8080/countries")
            .then(response => response.json())
            .then(data => this.setState({lists: {
                    ...this.state.lists,
                    countries: data.list
                }}))
        fetch("http://localhost:8080/languages")
            .then(response => response.json())
            .then(data => this.setState({lists: {
                    ...this.state.lists,
                    languages: data.list
                }}))
        fetch("http://localhost:8080/films/age-ratings")
            .then(response => response.json())
            .then(data => this.setState({lists: {
                    ...this.state.lists,
                    ageRatings: data
                }}))
        this.updateList({});
    }

    handleLanguageChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, languageId: event.target.value }}));
    };

    handleTitleChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, title: event.target.value }}));
    }

    handleProductionDateFromChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, productionDateFrom: date }}));
    }

    handleProductionDateToChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, productionDateTo: date }}));
    }

    handleAgeRatingChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, ageRating: event.target.value }}));
    }

    handleRatingFromChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, ratingFrom: event.target.value }}));
    }

    handleRatingToChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, ratingTo: event.target.value }}));
    }

    handleCountryChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, countryId: event.target.value }}));
    };

    handleCategoryChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, categoryId: event.target.value }}));
    };

    handlePersonChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, personId: event.target.value }}));
    };

    handleSortByChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, sortBy: event.target.value }}));
    };

    handleSortDirChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, sortDir: event.target.value }}));
    };

    render() {
        return (
            <div className="film-list">
                <div className="film-list-filter-toolbar">
                    <div className="film-list-filter-container">
                        <TextField label="Title"
                                   variant="outlined"
                                   type="search"
                                   value={this.state.filters.title}
                                   onChange={this.handleTitleChange}
                                   size="small"
                        />
                    </div>
                    <div className="film-list-filter-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                label="Production date from"
                                value={this.state.filters.productionDateFrom}
                                placeholder="01/01/1900"
                                onChange={date => this.handleProductionDateFromChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                size="small"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="film-list-filter-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                label="Production date to"
                                value={this.state.filters.productionDateTo}
                                placeholder="01/01/2100"
                                onChange={date => this.handleProductionDateToChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                size="small"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="film-list-filter-container">
                        <TextField select
                                   label="Language"
                                   variant="outlined"
                                   value={this.state.filters.languageId}
                                   onChange={this.handleLanguageChange}
                                   size="small"
                        >
                            <MenuItem value={"-"}>None</MenuItem>
                            {this.state.lists.languages
                                .map(language => (
                                    <MenuItem key={language.id} value={language.id}>
                                        {language.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="film-list-filter-container">
                        <TextField select
                                   label="Person"
                                   variant="outlined"
                                   value={this.state.filters.personId}
                                   onChange={this.handlePersonChange}
                                   size="small"
                        >
                            <MenuItem value={"-"}>None</MenuItem>
                            {this.state.lists.persons
                                .map(person => (
                                    <MenuItem key={person.id} value={person.id}>
                                        {person.firstname + " " + person.lastname}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="film-list-filter-container">
                        <TextField select
                                   label="Category"
                                   variant="outlined"
                                   value={this.state.filters.categoryId}
                                   onChange={this.handleCategoryChange}
                                   size="small"
                        >
                            <MenuItem value={"-"}>None</MenuItem>
                            {this.state.lists.categories
                                .map(category => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="film-list-filter-container">
                        <TextField select
                                   label="Country"
                                   variant="outlined"
                                   value={this.state.filters.countryId}
                                   onChange={this.handleCountryChange}
                                   size="small"
                        >
                            <MenuItem value={"-"}>None</MenuItem>
                            {this.state.lists.countries
                                .map(country => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="film-list-filter-container">
                        <TextField select
                                   label="Age rating"
                                   variant="outlined"
                                   value={this.state.filters.ageRating}
                                   onChange={this.handleAgeRatingChange}
                                   size="small"
                        >
                            <MenuItem value={"-"}>None</MenuItem>
                            {this.state.lists.ageRatings
                                .map(ageRating => (
                                    <MenuItem key={ageRating} value={ageRating}>
                                        {ageRating}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="film-list-filter-container">
                        <TextField label="Rating from"
                                   type="number"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   inputProps={{
                                       step: 1,
                                       min: 1,
                                       max: 10
                                   }}
                                   variant="outlined"
                                   value={this.state.filters.ratingFrom}
                                   onChange={this.handleRatingFromChange}
                                   size="small"
                        />
                    </div>
                    <div className="film-list-filter-container">
                        <TextField label="Rating to"
                                   type="number"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   inputProps={{
                                       step: 1,
                                       min: 1,
                                       max: 10
                                   }}
                                   variant="outlined"
                                   value={this.state.filters.ratingTo}
                                   onChange={this.handleRatingToChange}
                                   size="small"
                        />
                    </div>
                    <div className="film-list-filter-container">
                        <TextField select
                                   label="Sort by"
                                   variant="outlined"
                                   value={this.state.filters.sortBy}
                                   onChange={this.handleSortByChange}
                                   size="small"
                        >
                            {this.sortByList
                                .map(sortColumn => (
                                    <MenuItem key={sortColumn.value} value={sortColumn.value}>
                                        {sortColumn.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="film-list-filter-container">
                        <TextField select
                                   label="Sort direction"
                                   variant="outlined"
                                   value={this.state.filters.sortDir}
                                   onChange={this.handleSortDirChange}
                                   size="small"
                        >
                            {this.sortDirList
                                .map(sortDir => (
                                    <MenuItem key={sortDir.value} value={sortDir.value}>
                                        {sortDir.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="film-list-filter-submit">
                        <Button onClick={this.updateList}>
                            Search
                        </Button>
                    </div>
                </div>
                <div className="film-list-add">
                    <Button>
                        <Link to="/films/new">
                            Add new Film
                        </Link>
                    </Button>
                </div>
                <div className="film-list-pages">
                    <Pagination defaultPage={1} boundaryCount={3} count={this.state.pagesTotal} onChange={this.changePage}/>
                </div>
                <FilmList films={this.state.films}/>
                <div className="film-list-pages">
                    <Pagination defaultPage={1} boundaryCount={3} count={this.state.pagesTotal} onChange={this.changePage}/>
                </div>
            </div>
        );
    }
}



export default FilterableFilmList;


