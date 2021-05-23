import * as React from 'react';
import {
    useParams,
    Link
} from "react-router-dom";
import Review from "../reviews/Review"
import {ReviewData} from "../reviews/Review";
import "./Film.css"

import {strOrGap} from "../Utility";
import {Button} from "@material-ui/core";
import {backLink} from "../Utility";

interface FilmProps {
    id: string,
    canEdit: boolean,
    currentUserId: string|null
}

interface FilmData {
    title: string,
    shortDescription: string|null,
    fullDescription: string|null,
    productionDate: string | null,
    tagline: string | null,
    language: {id: string, name: string} | null,
    budget: string | null,
    boxOffice: string | null,
    minutesDuration: string,
    ageRating: string | null,
    rating: number | null,
    countries: {id: string, name: string}[],
    studios: {id: string, name: string}[],
    categories: {id: string, name: string}[],
    actors: {person: FilmPerson, role: string}[],
    scenarists: FilmPerson[],
    directors: FilmPerson[],
    producers: FilmPerson[],
    reviews: ReviewData[],
    reviewsCount: string,
}

interface FilmState {
    data: FilmData,
    isReviewExist: boolean,
    error: any,
    isLoaded: boolean
}

class Film extends React.Component<FilmProps, FilmState> {
    constructor(props : FilmProps) {
        super(props);
        this.state = {
            data: {
                title: '',
                shortDescription: null,
                fullDescription: null,
                productionDate: null,
                tagline: null,
                language: null,
                budget: null,
                boxOffice: null,
                minutesDuration: '0',
                ageRating: null,
                rating: null,
                countries: [],
                studios: [],
                categories: [],
                actors: [],
                scenarists: [],
                directors: [],
                producers: [],
                reviews: [],
                reviewsCount: '0'
            },
            isReviewExist: true,
            error: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        fetch(backLink + "/films/" + this.props.id)
            .then(response => response.json())
            .then(received => this.setState({
                data: {
                    title: received.film.title,
                    shortDescription: received.film.shortDescription,
                    fullDescription: received.film.fullDescription,
                    productionDate: received.film.productionDate,
                    tagline: received.film.tagline,
                    language: received.film.language,
                    budget: received.film.budget,
                    boxOffice: received.film.boxOffice,
                    minutesDuration: received.film.minutesDuration,
                    ageRating: received.film.ageRating,
                    rating: received.film.rating,
                    countries: received.film.countries,
                    categories: received.film.categories,
                    studios: received.film.studios,
                    actors: received.film.actors.map(function (actor: any) {
                        return {
                            id: actor.id,
                            person: getFilmPersonFromJson(actor.person),
                            role: actor.role
                        }
                    }),
                    scenarists: received.film.scenarists.map(getFilmPersonFromJson),
                    directors: received.film.directors.map(getFilmPersonFromJson),
                    producers: received.film.producers.map(getFilmPersonFromJson),
                    reviews: received.reviews.map(function (review : any) {
                        return {
                            user: {id: review.user.id, name: review.user.username},
                            film: {id: review.film.id, name: review.film.title},
                            postDate: review.postDate,
                            text: review.text,
                            rating: review.rating
                        }
                    }),
                    reviewsCount: received.reviewsCount
                },
                isLoaded: true
            }), error => {
                this.setState({
                    error: error,
                    isLoaded: true
                })
            });
        fetch(backLink + "/reviews/exist?userId=" + this.props.currentUserId + "&filmId=" + this.props.id)
            .then(response => response.json())
            .then(received => {
                this.setState({isReviewExist: received})
            });
    }

    render() {
        if (this.state.error) {
            return (<h1>This user doesn't exist</h1>);
        } else if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading...</h1>);
        } else {
            return (
                <div className="film">
                    <div className="film-title-div">
                        <h1 className="film-title">
                            {this.state.data.title}
                        </h1>
                        {this.state.data.ageRating !== null ? (
                            <span className="film-age-rating">{this.state.data.ageRating}</span>) : ""}
                        {this.props.canEdit ? (
                            <span className="film-edit">
                                <Button size="small">
                                    <Link to={"/films/edit/" + this.props.id}>
                                        Edit
                                    </Link>
                                </Button>
                            </span>
                        ) : ""}
                    </div>
                    <div className="film-short-description-div">
                        <span className="film-short-description">
                            {this.state.data.shortDescription !== null ? this.state.data.shortDescription : ""}
                        </span>
                    </div>
                    <div className="film-about-div">
                        <div className="film-about">
                            <h2>About: </h2>
                            <table className="film-about-table">
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Production date</th>
                                    <th className="film-about-table-values">
                                        {strOrGap(this.state.data.productionDate)}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Language</th>
                                    <th className="film-about-table-values">
                                        {this.state.data.language !== null ? (
                                            <Link to={"/languages/" + this.state.data.language.id}>
                                                {this.state.data.language.name}
                                            </Link>
                                        ) : "-"}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Country</th>
                                    <th className="film-about-table-values">
                                        {this.state.data.countries.length !== 0 ? this.state.data.countries.map((country, idx) =>
                                            (
                                                <span key={country.id}>
                                                    <Link to={"/countries/" + country.id}>
                                                        {country.name}{idx === this.state.data.countries.length - 1 ? "" : ", "}
                                                    </Link>
                                                </span>)
                                        ) : "-"}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Category</th>
                                    <th className="film-about-table-values">
                                        {this.state.data.categories.length !== 0 ? this.state.data.categories.map((category, idx) =>
                                            (
                                                <span key={category.id}>
                                                    <Link to={"/categories/" + category.id}>
                                                        {category.name}{idx === this.state.data.categories.length - 1 ? "" : ", "}
                                                    </Link>
                                                </span>)
                                        ) : "-"}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Studio</th>
                                    <th className="film-about-table-values">
                                        {this.state.data.studios.length !== 0 ? this.state.data.studios.map((studio, idx) =>
                                            (<span key={studio.id}>
                                                <Link to={"/studios/" + studio.id}>
                                                    {studio.name}{idx === this.state.data.studios.length - 1 ? "" : ", "}
                                                </Link>
                                            </span>)
                                        ) : "-"}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Tagline</th>
                                    <th className="film-about-table-values">
                                        {strOrGap(this.state.data.tagline)}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Director</th>
                                    <th className="film-about-table-values">
                                        {this.state.data.directors.length !== 0 ? this.state.data.directors.map((person, idx) =>
                                            (<span key={person.id}>
                                                <Link to={"/persons/" + person.id}>
                                                    {person.firstname + " " + strOrGap(person.lastname)}
                                                    {idx === this.state.data.directors.length - 1 ? "" : ", "}
                                                </Link>
                                            </span>)
                                        ) : "-"}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Scenarist</th>
                                    <th className="film-about-table-values">
                                        {this.state.data.scenarists.length !== 0 ? this.state.data.scenarists.map((person, idx) =>
                                            (<span key={person.id}>
                                                <Link to={"/persons/" + person.id}>
                                                    {person.firstname + " " + strOrGap(person.lastname)}
                                                    {idx === this.state.data.scenarists.length - 1 ? "" : ", "}
                                                </Link>
                                            </span>)
                                        ) : "-"}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Producer</th>
                                    <th className="film-about-table-values">
                                        {this.state.data.producers.length !== 0 ? this.state.data.producers.map((person, idx) =>
                                            (<span key={person.id}>
                                                <Link to={"/persons/" + person.id}>
                                                    {person.firstname + " " + strOrGap(person.lastname)}
                                                    {idx === this.state.data.producers.length - 1 ? "" : ", "}
                                                </Link>
                                            </span>)
                                        ) : "-"}
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Budget</th>
                                    <th className="film-about-table-values">
                                        {strOrGap(this.state.data.budget)}$
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Box office</th>
                                    <th className="film-about-table-values">
                                        {strOrGap(this.state.data.boxOffice)}$
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Age rating</th>
                                    <th className="film-about-table-values">
                                    <span className="film-age-rating">
                                        {strOrGap(this.state.data.ageRating)}
                                    </span>
                                    </th>
                                </tr>
                                <tr className="film-about-table-row">
                                    <th className="film-about-table-name">Duration</th>
                                    <th className="film-about-table-values">
                                        {(Math.floor(parseInt(this.state.data.minutesDuration) / 60)).toString()}
                                        :
                                        {
                                            (parseInt(this.state.data.minutesDuration) % 60 < 10 ? "0" : "") +
                                            (parseInt(this.state.data.minutesDuration) % 60).toString()
                                        }
                                    </th>
                                </tr>
                            </table>
                        </div>
                        <div className="film-actors">
                            <h3>Starring:</h3>
                            <ul className="film-actors-list">
                                {this.state.data.actors.map((actor, idx) =>
                                    (<li className="film-actors-list-element" key={actor.person.id + " " + actor.role}>
                                        <Link to={"/persons/" + actor.person.id}>
                                            {actor.person.firstname + " " + strOrGap(actor.person.lastname)}
                                        </Link> as {actor.role}
                                    </li>))}
                            </ul>
                        </div>
                    </div>
                    <div className="film-full-description-div">
                        <h3>Description</h3>
                        <div className="film-full-description">
                            {this.state.data.fullDescription !== null ?
                                this.state.data.fullDescription : "No description"}
                        </div>
                    </div>
                    <div className="film-rating-div">
                        <span>Rating: </span>
                        <span className={this.state.data.rating === null ? "film-rating" : (this.state.data.rating >= 6 ?
                            "film-rating-positive" : "film-rating-negative")}>
                            {this.state.data.rating !== null ? this.state.data.rating.toString().slice(0, 4) : "-"}</span>
                        <span className="film-rating-count">
                            {parseInt(this.state.data.reviewsCount) !== 0 ?
                                (<Link to={"/reviews/film/" + this.props.id}>
                                    {"(" + this.state.data.reviewsCount + " reviews)"}
                                </Link>) : ""}
                        </span>
                    </div>
                    <div className="film-reviews-div">
                        <h2 className="film-reviews-title">
                            Reviews
                        </h2>
                        {!this.state.isReviewExist ? (
                            <div className="review-add">
                                <Button>
                                    <Link to={"/reviews/film/add/" + this.props.id}>
                                        Add new review
                                    </Link>
                                </Button>
                            </div>
                        ) : ""}
                        {this.state.data.reviews.map((review) =>
                            (<Review key={review.user.id + " " + this.props.id}
                                     data = {review} known="film"
                                     canEdit={this.props.canEdit ||
                                     (this.props.currentUserId !== null && review.user.id == this.props.currentUserId)}/>)
                        )}
                        <div className="film-reviews-view-all">
                            <Button>
                                <Link to={"/reviews/film/" + this.props.id}>
                                    View all...
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

function FilmRouteWrapper(props: {canEdit: boolean, currentUserId: string|null}) {
    let {id} = useParams();
    return (
        <Film canEdit={props.canEdit} currentUserId={props.currentUserId} id={id}/>
    );
}

export default FilmRouteWrapper;
export interface FilmPerson {
    id: string,
    firstname: string,
    lastname: string|null
}

export function getFilmPersonFromJson(person : any) : FilmPerson {
    return {
        id: person.id,
        firstname: person.firstname,
        lastname: person.lastname
    }
}
