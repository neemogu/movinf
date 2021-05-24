import React from "react";
import {
    Button, MenuItem, TextField
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import "../films/FilmForm.css"
import {backLink} from "../Utility";

import {
    useParams,
    Redirect
} from "react-router-dom";

interface Id {
    id: string
}

interface PersonFormPersonData {
    id: string|null,
    firstname: string,
    lastname: string|null,
    birthdate: Date|null,
    country: Id|null
}

interface PersonFormState {
    person: PersonFormPersonData,
    countries: {id: string, name: string}[],
    isLoaded: boolean,
    error: any,
    redirect: boolean
}

interface PersonFormProps {
    id: string|null,
    authToken: string
}

function preparePerson(person: PersonFormPersonData) : PersonFormPersonData {
    person = {
        ...person,
        country: person.country !== null ? (person.country.id === "0" ? null : person.country) : person.country
    };
    return person;
}

class PersonForm extends React.Component<PersonFormProps, PersonFormState>{
    constructor(props: PersonFormProps) {
        super(props);
        this.state = {
            person: {
                id: this.props.id,
                firstname: '',
                lastname: '',
                birthdate: new Date(),
                country: {id: "0"}
            },
            countries: [],
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
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
        this.handleLastnameChange = this.handleLastnameChange.bind(this);
        this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
    }

    componentDidMount() {
        fetch(backLink + "/countries")
            .then(response => response.json())
            .then(data => this.setState({countries: data.list}))
        if (this.state.person.id !== null) {
            fetch(backLink + "/persons/" + this.state.person.id)
                .then(response => response.json())
                .then(data => this.setState({person: {
                        id: data.id,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        birthdate: new Date(data.birthdate),
                        country: data.country !== null ? data.country: {id: "0"}
                    }}))
        }
        this.setState({isLoaded: true});
    }

    submitForm() {
        let preparedPerson = preparePerson(JSON.parse(JSON.stringify(this.state.person)));
        const requestOptions: RequestInit = {
            method: preparedPerson.id === null ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.props.authToken},
            mode: 'cors',
            body: JSON.stringify(preparedPerson)
        };
        fetch(backLink + '/persons', requestOptions)
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
            });
    }

    deleteItem() {
        const requestOptions: RequestInit = {
            method: 'DELETE',
            headers: {'Authorization': 'Bearer ' + this.props.authToken},
            mode: 'cors',
        };
        fetch(backLink + '/persons/' + this.state.person.id, requestOptions)
            .then(response => response.json());
        this.setState({redirect: true});
    }


    handleCountryChange(event: any) {
        this.setState(prevState => ({person: { ...prevState.person, country: {id: event.target.value} }}));
    };

    handleFirstnameChange(event: any) {
        this.setState(prevState => ({person: { ...prevState.person, firstname: event.target.value }}));
    }

    handleLastnameChange(event: any) {
        this.setState(prevState => ({person: { ...prevState.person, lastname: event.target.value }}));
    }

    handleBirthdateChange(date: any) {
        this.setState(prevState => ({person: { ...prevState.person, birthdate: date }}));
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/persons"/>
        }
        if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading...</h1>);
        }
        return (
            <form className="film-form">
                <div className="form-text-field-container">
                    <span className="form-property-title">Firstname</span>
                    <div className="form-text-field">
                        <TextField label="Firstname"
                                   required
                                   multiline
                                   variant="outlined"
                                   value={this.state.person.firstname}
                                   onChange={this.handleFirstnameChange}
                                   size="small"
                                   error={this.state.error.firstname !== undefined}
                                   helperText={this.state.error.firstname !== undefined ? this.state.error.firstname : ""}
                        />
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">Lastname</span>
                    <div className="form-text-field">
                        <TextField label="Lastname"
                                   multiline
                                   variant="outlined"
                                   value={this.state.person.lastname === null ? "" : this.state.person.lastname}
                                   onChange={this.handleLastnameChange}
                                   size="small"
                                   error={this.state.error.lastname !== undefined}
                                   helperText={this.state.error.lastname !== undefined ? this.state.error.lastname : ""}
                        />
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">Birthdate</span>
                    <div className="form-text-field">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                value={this.state.person.birthdate === null ? new Date() : this.state.person.birthdate}
                                placeholder="01/01/2021"
                                onChange={date => this.handleBirthdateChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                InputAdornmentProps={{ position: "start" }}
                                size="small"
                                error={this.state.error.birthdate !== undefined}
                                helperText={this.state.error.birthdate !== undefined ? this.state.error.birthdate : ""}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">Country</span>
                    <div className="form-text-field">
                        <TextField select
                                   label="Country"
                                   variant="outlined"
                                   value={this.state.person.country === null ? "0" : this.state.person.country.id}
                                   onChange={this.handleCountryChange}
                                   size="small"
                        >
                            <MenuItem disabled value={"0"}>None</MenuItem>
                            {this.state.countries
                                .map(country => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                </div>
                <div className="form-submit">
                    <Button onClick={this.submitForm}>
                        Submit
                    </Button>
                    {this.state.person.id !== null ? (
                        <Button className="delete-button" onClick={this.deleteItem}>
                            Delete
                        </Button>
                    ) : <span/>}
                </div>
            </form>
        );
    }
}

function PersonFormRouteWrapper(props: {authToken: string|null}) {
    let {id} = useParams();
    let personId = id === undefined ? null : id;
    if (props.authToken === null) {
        return (<Redirect to="/"/>)
    }
    return (
        <PersonForm authToken={props.authToken} id={personId}/>
    );
}

export default PersonFormRouteWrapper;
