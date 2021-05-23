import React from "react";
import {
    Pagination
} from "@material-ui/lab"
import "./UserList.css"
import UserList from "./UserList";
import {UserData} from "./UserListElement"
import {Button, MenuItem, TextField} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

import {convertDate} from "../Utility";
import {backLink} from "../Utility";

interface UserListProps {
    canEditOrAdd: boolean
}

interface UserListState {
    users: UserData[],
    filters: UserFilters,
    lists: UserLists,
    pagesTotal: number,
    currentPage: number,
    error: any,
    isLoaded: boolean
}

interface UserLists {
    genders: string[]
}

interface UserFilters {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    birthdateFrom: Date,
    birthdateTo: Date,
    regDateFrom: Date,
    regDateTo: Date,
    gender: string,
    sortBy: string,
    sortDir: string
}

class FilterableUserList extends React.Component<UserListProps, UserListState>{
    pageSize = "5";
    sortByList = [
        {name: "Username", value: "username"},
        {name: "Firstname", value: "firstname"},
        {name: "Lastname", value: "lastname"},
        {name: "Email", value: "email"},
        {name: "Birthdate", value: "birthdate"},
        {name: "Registration date", value: "registrationDate"}
    ];
    sortDirList = [{name: "None", value: "-"}, {name: "Ascending", value: "asc"}, {name: "Descending", value: "desc"}]

    constructor(props: UserListProps) {
        super(props);
        this.state = {
            users: [],
            filters: {
                username: '',
                firstname: '',
                lastname: '',
                email: '',
                birthdateFrom: new Date('1900-01-01'),
                birthdateTo: new Date('2100-01-01'),
                regDateFrom: new Date('1900-01-01'),
                regDateTo: new Date('2100-01-01'),
                gender: "-",
                sortBy: this.sortByList[0].value,
                sortDir: this.sortDirList[0].value
            },
            lists: {
                genders: []
            },
            pagesTotal: 0,
            currentPage: 1,
            error: null,
            isLoaded: false
        };
        this.changePage = this.changePage.bind(this);
        this.updateList = this.updateList.bind(this);
        this.getUrlParams = this.getUrlParams.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
        this.handleLastnameChange = this.handleLastnameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleBirthdateFromChange = this.handleBirthdateFromChange.bind(this);
        this.handleBirthdateToChange = this.handleBirthdateToChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
        this.handleRegDateFromChange = this.handleRegDateFromChange.bind(this);
        this.handleRegDateToChange = this.handleRegDateToChange.bind(this);
        this.handleSortByChange = this.handleSortByChange.bind(this);
        this.handleSortDirChange = this.handleSortDirChange.bind(this);
    }

    getUrlParams() {
        return "pageSize=" + this.pageSize +
            "&username=" + this.state.filters.username +
            "&firstname=" + this.state.filters.firstname +
            "&lastname=" + this.state.filters.lastname +
            "&email=" + this.state.filters.email +
            "&regDateFrom=" + convertDate(this.state.filters.regDateFrom) +
            "&regDateTo=" + convertDate(this.state.filters.regDateTo) +
            "&birthdateFrom=" + convertDate(this.state.filters.birthdateFrom) +
            "&birthdateTo=" + convertDate(this.state.filters.birthdateTo) +
            (this.state.filters.gender !== "-" ? "&gender=" + this.state.filters.gender : "") +
            "&sortBy=" + this.state.filters.sortBy +
            (this.state.filters.sortDir !== "-" ? "&sortDirection=" + this.state.filters.sortDir : "");
    }

    changePage(event: object, page: number) {
        const params = this.getUrlParams();
        fetch(backLink + "/users/all/" + (page - 1).toString() + "?" + params)
            .then(response => response.json())
            .then(data => this.setState({
                users: data.map(function (user: any) {
                    return {
                        id: user.user.id,
                        username: user.user.username,
                        firstname: user.user.firstname,
                        lastname: user.user.lastname,
                        email: user.user.email
                    }
                }),
                isLoaded: true,
                currentPage: page
            }), error => {
                this.setState({
                    error: error,
                    isLoaded: true
                })
            });
    }

    updateList(event: any) {
        const params = this.getUrlParams();
        fetch(backLink + "/users/all/pages?" + params)
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
        fetch(backLink + "/users/genders-list")
            .then(response => response.json())
            .then(data => this.setState({lists: {
                    ...this.state.lists,
                    genders: data
                }}))
        this.updateList({});
    }

    handleUsernameChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, username: event.target.value }}));
    }

    handleFirstnameChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, firstname: event.target.value }}));
    }

    handleLastnameChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, lastname: event.target.value }}));
    }

    handleEmailChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, email: event.target.value }}));
    }

    handleRegDateFromChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, regDateFrom: date }}));
    }

    handleRegDateToChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, regDateTo: date }}));
    }

    handleBirthdateFromChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, birthdateFrom: date }}));
    }

    handleBirthdateToChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, birthdateTo: date }}));
    }

    handleGenderChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, gender: event.target.value }}));
    }

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
            return (<h1 className="loading">Loading...</h1>);
        }
        return (
            <div className="user-list">
                <div className="user-list-filter-toolbar">
                    <div className="user-list-filter-container">
                        <TextField label="Username"
                                   variant="outlined"
                                   type="search"
                                   value={this.state.filters.username}
                                   onChange={this.handleUsernameChange}
                                   size="small"
                        />
                    </div>
                    <div className="user-list-filter-container">
                        <TextField label="Firstname"
                                   variant="outlined"
                                   type="search"
                                   value={this.state.filters.firstname}
                                   onChange={this.handleFirstnameChange}
                                   size="small"
                        />
                    </div>
                    <div className="user-list-filter-container">
                        <TextField label="Lastname"
                                   variant="outlined"
                                   type="search"
                                   value={this.state.filters.lastname}
                                   onChange={this.handleLastnameChange}
                                   size="small"
                        />
                    </div>
                    <div className="user-list-filter-container">
                        <TextField label="Email"
                                   variant="outlined"
                                   type="search"
                                   value={this.state.filters.email}
                                   onChange={this.handleEmailChange}
                                   size="small"
                        />
                    </div>
                    <div className="user-list-filter-container">
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
                    <div className="user-list-filter-container">
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
                    <div className="user-list-filter-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                label="Registration date from"
                                value={this.state.filters.regDateFrom}
                                placeholder="01/01/1900"
                                onChange={date => this.handleRegDateFromChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                size="small"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="user-list-filter-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                label="Registration date to"
                                value={this.state.filters.regDateTo}
                                placeholder="01/01/2100"
                                onChange={date => this.handleRegDateToChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                size="small"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="film-list-filter-container">
                        <TextField select
                                   label="Gender"
                                   variant="outlined"
                                   value={this.state.filters.gender}
                                   onChange={this.handleGenderChange}
                                   size="small"
                        >
                            <MenuItem value={"-"}>Any</MenuItem>
                            {this.state.lists.genders
                                .map(gender => (
                                    <MenuItem key={gender} value={gender}>
                                        {gender}
                                    </MenuItem>
                                ))}
                        </TextField>
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
                <div className="film-list-pages">
                    <Pagination page={this.state.currentPage} defaultPage={1} boundaryCount={3}
                                count={this.state.pagesTotal} onChange={this.changePage}/>
                </div>
                <UserList canEdit={this.props.canEditOrAdd} users={this.state.users}/>
                <div className="film-list-pages">
                    <Pagination page={this.state.currentPage} defaultPage={1} boundaryCount={3}
                                count={this.state.pagesTotal} onChange={this.changePage}/>
                </div>
            </div>
        );
    }
}

export default FilterableUserList;
