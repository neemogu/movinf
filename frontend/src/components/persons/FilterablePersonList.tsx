import React from "react";
import {
    Pagination
} from "@material-ui/lab"
import "./PersonList.css"
import {PersonData} from "./PersonListElement"
import {Button, MenuItem, TextField} from "@material-ui/core";
import {Link} from "react-router-dom"
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import PersonList from "./PersonList";
import {convertDate} from "../Utility";

interface PersonListProps {
    canEditOrAdd: boolean
}

interface PersonListState {
    persons: PersonData[],
    filters: PersonFilters,
    lists: PersonFilterLists,
    pagesTotal: number,
    error: any,
    isLoaded: boolean
}

interface PersonFilters {
    firstname: string,
    lastname: string,
    birthdateFrom: Date,
    birthdateTo: Date,
    countryId: string,
    sortBy: string,
    sortDir: string
}

interface PersonFilterLists {
    countries: {id: string, name: string}[]
}

class FilterablePersonList extends React.Component<PersonListProps, PersonListState>{
    pageSize = "10";
    sortByList = [
        {name: "Firstname", value: "firstname"},
        {name: "Lastname", value: "lastname"},
        {name: "Birthdate", value: "birthdate"},
        {name: "Country", value: "country"},
    ];
    sortDirList = [{name: "None", value: "-"}, {name: "Ascending", value: "asc"}, {name: "Descending", value: "desc"}]

    constructor(props: PersonListProps) {
        super(props);
        this.state = {
            persons: [],
            filters: {
                firstname: '',
                lastname: '',
                birthdateFrom: new Date("1900-01-01"),
                birthdateTo: new Date("2100-01-01"),
                countryId: "-",
                sortBy: this.sortByList[0].value,
                sortDir: this.sortDirList[0].value
            },
            lists: {
                countries: []
            },
            pagesTotal: 0,
            error: null,
            isLoaded: false
        };
        this.changePage = this.changePage.bind(this);
        this.updateList = this.updateList.bind(this);
        this.getUrlParams = this.getUrlParams.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
        this.handleLastnameChange = this.handleLastnameChange.bind(this);
        this.handleBirthdateFromChange = this.handleBirthdateFromChange.bind(this);
        this.handleBirthdateToChange = this.handleBirthdateToChange.bind(this);
        this.handleSortByChange = this.handleSortByChange.bind(this);
        this.handleSortDirChange = this.handleSortDirChange.bind(this);
    }

    getUrlParams() {
        return "pageSize=" + this.pageSize +
            "&firstname=" + this.state.filters.firstname +
            "&lastname=" + this.state.filters.lastname +
            "&birthdateFrom=" + convertDate(this.state.filters.birthdateFrom) +
            "&birthdateTo=" + convertDate(this.state.filters.birthdateTo) +
            (this.state.filters.countryId !== "-" ? "&countryId=" + this.state.filters.countryId : "") +
            "&sortBy=" + this.state.filters.sortBy +
            (this.state.filters.sortDir !== "-" ? "&sortDirection=" + this.state.filters.sortDir : "");
    }

    changePage(event: object, page: number) {
        const params = this.getUrlParams();
        fetch("http://localhost:8080/persons/all/" + (page - 1).toString() + "?" + params)
            .then(response => response.json())
            .then(data => this.setState({
                persons: data.list.map(function (person: any) {
                    return {
                        id: person.id,
                        firstname: person.firstname,
                        lastname: person.lastname,
                        birthdate: person.birthdate,
                        country: person.country,
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
        fetch("http://localhost:8080/persons/all/pages?" + params)
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
        fetch("http://localhost:8080/countries")
            .then(response => response.json())
            .then(data => this.setState({lists: {
                    ...this.state.lists,
                    countries: data.list
                }}))
        this.updateList({});
    }

    handleFirstnameChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, firstname: event.target.value }}));
    }

    handleLastnameChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, lastname: event.target.value }}));
    }

    handleBirthdateFromChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, birthdateFrom: date }}));
    }

    handleBirthdateToChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, birthdateTo: date }}));
    }

    handleCountryChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, countryId: event.target.value }}));
    };

    handleSortByChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, sortBy: event.target.value }}));
    };

    handleSortDirChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, sortDir: event.target.value }}));
    };

    render() {
        if (this.state.error) {
            return (<div>Error occurred, try to refresh a page</div>);
        }
        if (!this.state.isLoaded) {
            return (<div>Loading...</div>);
        }
        return (
            <div className="person-list">
                <div className="person-list-filter-toolbar">
                    <div className="person-list-filter-container">
                        <TextField label="Firstname"
                                   variant="outlined"
                                   type="search"
                                   value={this.state.filters.firstname}
                                   onChange={this.handleFirstnameChange}
                                   size="small"
                        />
                    </div>
                    <div className="person-list-filter-container">
                        <TextField label="Lastname"
                                   variant="outlined"
                                   type="search"
                                   value={this.state.filters.lastname}
                                   onChange={this.handleLastnameChange}
                                   size="small"
                        />
                    </div>
                    <div className="person-list-filter-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                label="Birthdate from"
                                value={this.state.filters.birthdateFrom}
                                placeholder="01/01/1900"
                                onChange={date => this.handleBirthdateFromChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                size="small"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="person-list-filter-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                label="Birthdate to"
                                value={this.state.filters.birthdateTo}
                                placeholder="01/01/2100"
                                onChange={date => this.handleBirthdateToChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                size="small"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="person-list-filter-container">
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
                    <div className="person-list-filter-container">
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
                    <div className="person-list-filter-container">
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
                    <div className="person-list-filter-submit">
                        <Button onClick={this.updateList}>
                            Search
                        </Button>
                    </div>
                </div>
                <div className="person-list-add">
                    <Button>
                        <Link to="/persons/new">
                            Add new person
                        </Link>
                    </Button>
                </div>
                <div className="person-list-pages">
                    <Pagination defaultPage={1} boundaryCount={3} count={this.state.pagesTotal} onChange={this.changePage}/>
                </div>
                <PersonList canEdit={this.props.canEditOrAdd} persons={this.state.persons}/>
                <div className="person-list-pages">
                    <Pagination defaultPage={1} boundaryCount={3} count={this.state.pagesTotal} onChange={this.changePage}/>
                </div>
            </div>
        );
    }
}



export default FilterablePersonList;


