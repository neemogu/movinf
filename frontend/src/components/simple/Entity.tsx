import React from "react";
import {
    Link,
    useParams
} from "react-router-dom"

import {FilmData} from "../films/FilmListElement";
import {PersonData} from "../persons/PersonListElement";
import {strOrGap} from "../Utility";
import "./Entity.css";
import {AppBar, Button, Tab} from "@material-ui/core";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import FilmList from "../films/FilmList";
import PersonList from "../persons/PersonList"
import {backLink} from "../Utility";

interface EntityProps {
    id: string,
    link: string,
    canEdit: boolean
}

interface EntityData {
    name: string,
    films: FilmData[],
    persons: PersonData[]|null
}

interface EntityState {
    data: EntityData,
    isLoaded: boolean,
    error: any,
    selectedTab: string
}

function jsonFilmToFilmData(jsonFilm: any) {
    return {
        id: jsonFilm.id,
        title: jsonFilm.title,
        shortDescription: jsonFilm.shortDescription,
        productionDate: jsonFilm.productionDate,
        language: jsonFilm.language,
        ageRating: jsonFilm.ageRating,
        rating: jsonFilm.rating,
        countries: jsonFilm.countries,
        categories: jsonFilm.categories,
        reviewsCount: jsonFilm.reviewsCount
    }
}

function jsonPersonToPersonData(jsonPerson: any) {
    return {
        id: jsonPerson.id,
        firstname: jsonPerson.firstname,
        lastname: jsonPerson.lastname,
        birthdate: jsonPerson.birthdate,
        country: jsonPerson.country,
    };
}

class Entity extends React.Component<EntityProps, EntityState>{
    constructor(props: EntityProps) {
        super(props);
        this.state = {
            data: {
                name: '',
                films: [],
                persons: null
            },
            isLoaded: false,
            error: null,
            selectedTab: "films"
        };
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(event: React.ChangeEvent<{}>, newValue: string) {
        this.setState({selectedTab: newValue});
    }

    componentDidMount() {
        fetch(backLink + this.props.link + "/" + this.props.id)
            .then(response => response.json())
            .then(received => this.setState({
                data: {
                    name: received.name,
                    films: received.films.map(jsonFilmToFilmData),
                    persons: received.persons !== undefined ? received.persons.map(jsonPersonToPersonData) : null
                },
                isLoaded: true
            }), error => {
                this.setState({
                    error: error,
                    isLoaded: true
                })
            });
    }

    render() {
        if (this.state.error) {
            return (<div>Error occurred, try to refresh a page</div>);
        }
        if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading...</h1>);
        }
        return (
            <div className="entity">
                <div className="entity-name-div">
                    {this.props.canEdit ? (
                        <span className="entity-edit">
                            <Button size="small">
                                <Link to={this.props.link + "/edit/" + this.props.id}>
                                    Edit
                                </Link>
                            </Button>
                        </span>
                    ) : ""}
                    <h1 className="entity-name">
                        {this.state.data.name}
                    </h1>
                </div>
                <div className="entity-films-persons">
                    {this.state.data.persons !== null ? (
                        <TabContext value={this.state.selectedTab}>
                            <AppBar position="static">
                                <TabList onChange={this.handleTabChange}>
                                    <Tab label="Films" value="films" />
                                    <Tab label="Persons" value="persons" />
                                </TabList>
                            </AppBar>
                            <TabPanel value="films">
                                <FilmList canEdit={false} films={this.state.data.films}/>
                            </TabPanel>
                            <TabPanel value="persons">
                                <PersonList canEdit={false} persons={this.state.data.persons}/>
                            </TabPanel>
                        </TabContext>
                    ) : (
                        <FilmList films={this.state.data.films} canEdit={false}/>
                    )}
                </div>
            </div>
        );
    }
}

function EntityRouteWrapper(props: {link: string, canEdit: boolean}) {
    let {id} = useParams();
    return (
        <Entity id={id} link={props.link} canEdit={props.canEdit}/>
    );
}

export default EntityRouteWrapper;
