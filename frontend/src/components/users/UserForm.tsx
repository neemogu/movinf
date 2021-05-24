import React from "react";
import {
    Button, MenuItem, TextField
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import "./UserForm.css";
import "../films/FilmForm.css"
import {backLink} from "../Utility";

import {
    useParams,
    Redirect
} from "react-router-dom";

interface UserFormUserData {
    id: string|null,
    username: string,
    password: string,
    firstname: string|null,
    lastname: string|null,
    email: string,
    birthdate: Date|null,
    gender: string
}

interface UserFormState {
    user: UserFormUserData,
    genders: string[],
    isLoaded: boolean,
    error: any,
    redirect: boolean
}

interface UserFormProps {
    id: string|null,
    authToken: string|null
}

class UserForm extends React.Component<UserFormProps, UserFormState>{
    constructor(props: UserFormProps) {
        super(props);
        this.state = {
            user: {
                id: this.props.id,
                username: '',
                password: '',
                firstname: null,
                lastname: null,
                email: '',
                birthdate: null,
                gender: "Male"
            },
            genders: [],
            isLoaded: false,
            error: {},
            redirect: false
        }
        this.bindHandles = this.bindHandles.bind(this);
        this.bindHandles();
    }

    bindHandles() {
        this.submitForm = this.submitForm.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
        this.handleLastnameChange = this.handleLastnameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
    }

    componentDidMount() {
        fetch(backLink + "/users/genders-list")
            .then(response => response.json())
            .then(data => this.setState({genders: data}))
        if (this.state.user.id !== null) {
            fetch(backLink + "/users/" + this.state.user.id)
                .then(response => response.json())
                .then(data => this.setState({
                    user: {
                        id: data.user.id,
                        username: data.user.username,
                        password: '',
                        firstname: data.user.firstname,
                        lastname: data.user.lastname,
                        email: data.user.email,
                        birthdate: data.user.birthdate,
                        gender: data.user.gender
                    }}))
        }
        this.setState({isLoaded: true});
    }

    submitForm() {
        const registerRequestOptions: RequestInit = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.user)
        };
        const editRequestOptions: RequestInit = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.props.authToken},
            mode: 'cors',
            body: JSON.stringify(this.state.user)
        };
        fetch(backLink + (this.state.user.id === null ? '/auth/register' : '/user'),
            this.state.user.id === null ? registerRequestOptions : editRequestOptions)
            .then(response => {
                if (response.ok) {
                    this.setState({redirect: true});
                    return response.json();
                } else if (response.status === 409) {
                    alert("Username or email is already exist");
                    return response.text();
                } else {
                    window.scrollTo(0, 0);
                    return response.json();
                }
            })
            .then(errors => {
                this.setState({error: errors});
            });
    }

    handleGenderChange(event: any) {
        this.setState(prevState => ({user: { ...prevState.user, gender: event.target.value }}));
    };

    handlePasswordChange(event: any) {
        this.setState(prevState => ({user: { ...prevState.user, password: event.target.value }}));
    }

    handleUsernameChange(event: any) {
        this.setState(prevState => ({user: { ...prevState.user, username: event.target.value }}));
    }

    handleFirstnameChange(event: any) {
        this.setState(prevState => ({user: { ...prevState.user, firstname: event.target.value }}));
    }

    handleLastnameChange(event: any) {
        this.setState(prevState => ({user: { ...prevState.user, lastname: event.target.value }}));
    }

    handleEmailChange(event: any) {
        this.setState(prevState => ({user: { ...prevState.user, email: event.target.value }}));
    }

    handleBirthdateChange(date: any) {
        this.setState(prevState => ({user: { ...prevState.user, birthdate: date }}));
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/"/>
        }
        if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading</h1>);
        }
        return (
            <form className="user-form">
                <div className="form-text-field-container">
                    <span className="form-property-title">Username</span>
                    <div className="form-text-field">
                        <TextField label="Username"
                                   required
                                   variant="outlined"
                                   value={this.state.user.username}
                                   onChange={this.handleUsernameChange}
                                   size="small"
                                   error={this.state.error.username !== undefined}
                                   helperText={this.state.error.username !== undefined ? this.state.error.username : ""}
                        />
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">{this.props.id !== null ? "New password" : "Password"}</span>
                    <div className="form-text-field">
                        <TextField label="Password"
                                   type="password"
                                   required
                                   variant="outlined"
                                   value={this.state.user.password}
                                   onChange={this.handlePasswordChange}
                                   size="small"
                                   error={this.state.error.password !== undefined}
                                   helperText={this.state.error.password !== undefined ? this.state.error.password : ""}
                        />
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">Firstname</span>
                    <div className="form-text-field">
                        <TextField label="Firstname"
                                   variant="outlined"
                                   size="small"
                                   value={this.state.user.firstname === null ? "" : this.state.user.firstname}
                                   onChange={this.handleFirstnameChange}
                                   error={this.state.error.firstname !== undefined}
                                   helperText={this.state.error.firstname !== undefined ? this.state.error.firstname : ""}
                        />
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">Lastname</span>
                    <div className="form-text-field">
                        <TextField label="Lastname"
                                   variant="outlined"
                                   size="small"
                                   value={this.state.user.lastname === null ? "" : this.state.user.lastname}
                                   onChange={this.handleLastnameChange}
                                   error={this.state.error.lastname !== undefined}
                                   helperText={this.state.error.lastname !== undefined ? this.state.error.lastname : ""}
                        />
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">Email</span>
                    <div className="form-text-field">
                        <TextField label="Email"
                                   required
                                   variant="outlined"
                                   size="small"
                                   value={this.state.user.email === null ? "" : this.state.user.email}
                                   onChange={this.handleEmailChange}
                                   error={this.state.error.email !== undefined}
                                   helperText={this.state.error.email !== undefined ? this.state.error.email : ""}
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
                                value={this.state.user.birthdate === null ? new Date() : this.state.user.birthdate}
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
                    <span className="form-property-title">Gender</span>
                    <div className="form-text-field">
                        <TextField select
                                   label="Gender"
                                   variant="outlined"
                                   value={this.state.user.gender}
                                   onChange={this.handleGenderChange}
                                   size="small"
                        >
                            {this.state.genders
                                .map(gender => (
                                    <MenuItem key={gender} value={gender}>
                                        {gender}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                </div>
                <div className="form-submit">
                    <Button onClick={this.submitForm}>
                        Submit
                    </Button>
                </div>
            </form>
        );
    }
}

function UserFormRouteWrapper(props: {currentUserId: string|null, canEdit: boolean, authToken: string|null}) {
    const {id} = useParams();
    let userId = id === undefined ? null : id;
    if (userId !== null && props.currentUserId != userId && !props.canEdit) {
        return (<Redirect to="/"/>);
    }
    return (
        <UserForm authToken={props.authToken} id={userId}/>
    );
}

export default UserFormRouteWrapper;
