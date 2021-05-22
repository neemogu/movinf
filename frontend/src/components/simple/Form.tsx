import React from "react";
import {
    Button, TextField
} from "@material-ui/core";

import "../films/FilmForm.css"
import {backLink} from "../Utility";

import {
    useParams,
    Redirect
} from "react-router-dom";

interface FormData {
    id: string|null,
    name: string
}

interface FormState {
    data: FormData,
    isLoaded: boolean,
    error: any,
    redirect: boolean
}

interface FormProps {
    id: string|null,
    link: string
}

function findInList(id: string|null, list: {id: string, name: string}[]) {
    for (let i = 0; i < list.length; ++i) {
        if (id == list[i].id) {
            return list[i];
        }
    }
    return null;
}

class Form extends React.Component<FormProps, FormState>{
    constructor(props: FormProps) {
        super(props);
        this.state = {
            data: {
                id: this.props.id,
                name: ''
            },
            isLoaded: false,
            error: {},
            redirect: false
        }
        this.deleteItem = this.deleteItem.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
        if (this.state.data.id !== null) {
            fetch(backLink + this.props.link)
                .then(response => response.json())
                .then(data => {
                    let entity = findInList(this.state.data.id, data.list);
                    if (entity !== null) {
                        this.setState({
                            data: {
                                name: entity.name,
                                id: entity.id
                            },
                            isLoaded: true
                        });
                    }
                }, error => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    })
                })
        } else {
            this.setState({
                isLoaded: true
            });
        }
    }

    submitForm() {
        const requestOptions = {
            method: this.state.data.id === null ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.data)
        };
        fetch(backLink + this.props.link, requestOptions)
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
        const requestOptions = {
            method: 'DELETE'
        };
        fetch(backLink + this.props.link + "/" + this.state.data.id, requestOptions)
            .then(response => response.json());
        this.setState({redirect: true});
    }


    handleNameChange(event: any) {
        this.setState(prevState => ({data: { ...prevState.data, name: event.target.value }}));
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.props.link}/>
        }
        if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading...</h1>);
        }
        return (
            <form className="film-form">
                <div className="form-text-field-container">
                    <span className="form-property-title">Name</span>
                    <div className="form-text-field">
                        <TextField label="Name"
                                   required
                                   multiline
                                   variant="outlined"
                                   value={this.state.data.name}
                                   onChange={this.handleNameChange}
                                   size="small"
                                   error={this.state.error.name !== undefined}
                                   helperText={this.state.error.name !== undefined ? this.state.error.name : ""}
                        />
                    </div>
                </div>
                <div className="form-submit">
                    <Button onClick={this.submitForm}>
                        Submit
                    </Button>
                    {this.state.data.id !== null ? (
                        <Button className="delete-button" onClick={this.deleteItem}>
                            Delete
                        </Button>
                    ) : <span/>}
                </div>
            </form>
        );
    }
}

function FormRouteWrapper(props: {link: string}) {
    let {id} = useParams();
    let entityId = id === undefined ? null : id;
    return (
        <Form id={entityId} link={props.link}/>
    );
}

export default FormRouteWrapper;

