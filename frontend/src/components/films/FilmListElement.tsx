import React from "react";
import "./FilmList.css"
import "./Film.css"
import {strOrGap} from "./Film"
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";

interface FilmListElementProps {
    filmData: FilmData
}

class FilmListElement extends React.Component<FilmListElementProps> {
    render() {
        return (
            <div className="film-list-element">
                <div className="film-title-div">
                    <h2 className="film-title">
                        <Link to={"/films/" + this.props.filmData.id} >
                            {this.props.filmData.title}
                        </Link>
                    </h2>
                    {this.props.filmData.ageRating !== null ? (
                        <span className="film-age-rating">{this.props.filmData.ageRating}</span>) : ""}
                </div>
                <div className="film-short-description-div">
                        <span className="film-short-description">
                            {this.props.filmData.shortDescription !== null ? this.props.filmData.shortDescription : ""}
                        </span>
                </div>
                <div className="film-list-element-about">
                    <table className="film-about-table">
                        <tr className="film-about-table-row">
                            <th className="film-about-table-name">Production date</th>
                            <th className="film-about-table-values">
                                {strOrGap(this.props.filmData.productionDate)}
                            </th>
                        </tr>
                        <tr className="film-about-table-row">
                            <th className="film-about-table-name">Language</th>
                            <th className="film-about-table-values">
                                {this.props.filmData.language !== null ? this.props.filmData.language.name : "-"}
                            </th>
                        </tr>
                        <tr className="film-about-table-row">
                            <th className="film-about-table-name">Country</th>
                            <th className="film-about-table-values">
                                {this.props.filmData.countries.length !== 0 ? this.props.filmData.countries.map((country, idx) =>
                                    (<span key={country.id}>
                                            {country.name}{idx === this.props.filmData.countries.length - 1 ? "" : ", "}
                                        </span>)
                                ) : "-"}
                            </th>
                        </tr>
                        <tr className="film-about-table-row">
                            <th className="film-about-table-name">Category</th>
                            <th className="film-about-table-values">
                                {this.props.filmData.categories.length !== 0 ? this.props.filmData.categories.map((category, idx) =>
                                    (<span key={category.id}>
                                            {category.name}{idx === this.props.filmData.categories.length - 1 ? "" : ", "}
                                        </span>)
                                ) : "-"}
                            </th>
                        </tr>
                    </table>
                </div>
                <div className="film-rating-div">
                    <span>Rating: </span>
                    <span className={this.props.filmData.rating === null ? "film-rating" : (this.props.filmData.rating >= 6 ?
                        "film-rating-positive" : "film-rating-negative")}>
                            {this.props.filmData.rating !== null ? this.props.filmData.rating.toString().slice(0, 4) : "-"}</span>
                    <span className="film-rating-count">{parseInt(this.props.filmData.reviewsCount) !== 0 ?
                        "(" + this.props.filmData.reviewsCount + " reviews)" : ""}</span>
                    <span className="film-edit">
                        <Button size="small">
                            <Link to={"/films/edit/" + this.props.filmData.id}>
                                Edit
                            </Link>
                        </Button>
                    </span>
                </div>
            </div>
        );
    }
}

export default FilmListElement;
export interface FilmData {
    id: string,
    title: string,
    shortDescription: string|null,
    productionDate: string | null,
    language: {id: string, name: string} | null,
    ageRating: string | null,
    rating: number | null,
    countries: {id: string, name: string}[],
    categories: {id: string, name: string}[],
    reviewsCount: string
}
