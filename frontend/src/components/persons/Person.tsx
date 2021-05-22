import React from "react";
import {
    Link,
    useParams
} from "react-router-dom"

import {FilmData} from "../films/FilmListElement";
import {strOrGap} from "../Utility";
import "./Person.css";
import {AppBar, Button, Tab} from "@material-ui/core";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import FilmList from "../films/FilmList";
import {backLink} from "../Utility";

interface PersonProps {
    id: string,
    canEdit: boolean
}

interface PersonData {
    firstname: string,
    lastname: string|null,
    birthdate: string|null,
    country: {id: string, name: string}|null,
    asActorFilms: FilmData[],
    asProducerFilms: FilmData[],
    asDirectorFilms: FilmData[],
    asScenaristFilms: FilmData[]
}

interface PersonState {
    data: PersonData,
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

class Person extends React.Component<PersonProps, PersonState>{
    constructor(props: PersonProps) {
        super(props);
        this.state = {
            data: {
                firstname: '',
                lastname: null,
                birthdate: null,
                country: null,
                asActorFilms: [],
                asDirectorFilms: [],
                asProducerFilms: [],
                asScenaristFilms: [],
            },
            isLoaded: false,
            error: null,
            selectedTab: "actor"
        };
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(event: React.ChangeEvent<{}>, newValue: string) {
        this.setState({selectedTab: newValue});
    }

    componentDidMount() {
        fetch(backLink + "/persons/" + this.props.id)
            .then(response => response.json())
            .then(received => this.setState({
                data: {
                    firstname: received.firstname,
                    lastname: received.lastname,
                    birthdate: received.birthdate,
                    country: received.country,
                    asActorFilms: received.asActorFilms.map(function (actor: any) {
                        return jsonFilmToFilmData(actor.film);
                    }),
                    asDirectorFilms: received.asDirectorFilms.map(jsonFilmToFilmData),
                    asScenaristFilms: received.asScenaristFilms.map(jsonFilmToFilmData),
                    asProducerFilms: received.asProducerFilms.map(jsonFilmToFilmData)
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
            <div className="person">
                <div className="person-name-div">
                    {this.props.canEdit ? (
                        <span className="person-edit">
                            <Button size="small">
                                <Link to={"/persons/edit/" + this.props.id}>
                                    Edit
                                </Link>
                            </Button>
                        </span>
                    ) : ""}
                    <h1 className="person-name">
                        {this.state.data.firstname + " " +
                        (this.state.data.lastname !== null ? this.state.data.lastname : "")}
                    </h1>
                </div>
                <div className="person-about">
                    <h2>About: </h2>
                    <table className="person-about-table">
                        <tr className="person-about-table-row">
                            <th className="person-about-table-name">Birthdate</th>
                            <th className="film-about-table-values">
                                {strOrGap(this.state.data.birthdate)}
                            </th>
                        </tr>
                        <tr className="person-about-table-row">
                            <th className="person-about-table-name">Country</th>
                            <th className="person-about-table-values">
                                {this.state.data.country !== null ? this.state.data.country.name : "-"}
                            </th>
                        </tr>
                    </table>
                </div>
                <div className="person-films-div">
                    <h2>Films</h2>
                    <div className="person-films">
                        <TabContext value={this.state.selectedTab}>
                            <AppBar position="static">
                                <TabList onChange={this.handleTabChange} aria-label="Person films">
                                    <Tab label="As actor" value="actor" />
                                    <Tab label="As director" value="director" />
                                    <Tab label="As producer" value="producer" />
                                    <Tab label="As scenarist" value="scenarist" />
                                </TabList>
                            </AppBar>
                            <TabPanel value="actor">
                                <FilmList canEdit={false} films={this.state.data.asActorFilms}/>
                            </TabPanel>
                            <TabPanel value="director">
                                <FilmList canEdit={false} films={this.state.data.asDirectorFilms}/>
                            </TabPanel>
                            <TabPanel value="producer">
                                <FilmList canEdit={false} films={this.state.data.asProducerFilms}/>
                            </TabPanel>
                            <TabPanel value="scenarist">
                                <FilmList canEdit={false} films={this.state.data.asScenaristFilms}/>
                            </TabPanel>
                        </TabContext>
                    </div>
                </div>
            </div>
        );
    }
}

function PersonRouteWrapper(props: {canEdit: boolean}) {
    let {id} = useParams();
    return (
        <Person canEdit={props.canEdit} id={id}/>
    );
}

export default PersonRouteWrapper;
