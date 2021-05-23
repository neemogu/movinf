import React from "react";
import {
    Button, TextField
} from "@material-ui/core";

import "./UserForm.css";
import "../films/FilmForm.css"
import {backLink} from "../Utility";

import {
    Redirect
} from "react-router-dom";

interface LoginFormUserData {
    username: string,
    password: string,
}

interface LoginFormState {
    user: LoginFormUserData,
    error: boolean,
    redirect: boolean
}

interface LoginFormProps {
    authHandler: (role: string, user: string, authToken: string) => void
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState>{
    constructor(props: LoginFormProps) {
        super(props);
        this.state = {
            user: {
                username: '',
                password: '',
            },
            error: false,
            redirect: false
        }
        this.bindHandles = this.bindHandles.bind(this);
        this.bindHandles();
    }

    bindHandles() {
        this.submitForm = this.submitForm.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    submitForm() {
        const requestOptions = {
            method: 'POST'
        };
        fetch(backLink + '/login', requestOptions)
            .then(async response => {
                if (response.ok) {
                    this.setState({redirect: true});
                    const token = await response.text();
                    const loggedRequestOptions = {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + token}
                    };
                    fetch(backLink + '/user/current')
                        .then(response => response.json())
                        .then(user => this.props.authHandler(user.role, user.id, token))
                } else {
                    window.scrollTo(0, 0);
                    this.setState({error: true})
                }
            });
    }

    handlePasswordChange(event: any) {
        this.setState(prevState => ({user: { ...prevState.user, password: event.target.value }}));
    }

    handleUsernameChange(event: any) {
        this.setState(prevState => ({user: { ...prevState.user, username: event.target.value }}));
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/"/>
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
                        />
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">Password</span>
                    <div className="form-text-field">
                        <TextField label="Password"
                                   type="password"
                                   variant="outlined"
                                   value={this.state.user.password}
                                   onChange={this.handlePasswordChange}
                                   size="small"
                        />
                    </div>
                </div>
                <div className="form-submit">
                    <Button onClick={this.submitForm}>
                        Login
                    </Button>
                </div>
            </form>
        );
    }
}

export default LoginForm;
