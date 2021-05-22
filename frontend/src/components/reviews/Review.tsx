import * as React from 'react';
import "./Review.css"
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";

interface ReviewProps {
    data: ReviewData,
    known: "film"|"user",
    canEdit: boolean
}

class Review extends React.Component<ReviewProps> {
    render() {
        return (
            <div className={parseInt(this.props.data.rating) > 5 ? "review-div-positive" : "review-div-negative"}>
                <div className="review-header">
                    {this.props.known === "film" ? (
                        <div className="review-header-username">
                            <Link to={"/users/" + this.props.data.user.id}>
                                {this.props.data.user.name}
                            </Link>
                        </div>
                    ) : (
                        <div className="review-header-film">
                            <Link to={"/films/" + this.props.data.film.id}>
                                {this.props.data.film.name}
                            </Link>
                        </div>
                    )}
                    <div className="review-header-postdate">
                        Posted on {this.props.data.postDate}
                    </div>
                </div>
                <div className="review-body">
                    <div className="review-text">
                        {this.props.data.text}
                    </div>
                </div>
                <div className="review-footer">
                    {this.props.canEdit ? (
                        <div className="review-edit">
                            <Button size="small">
                                <Link to={"/reviews/film/edit/" + this.props.data.film.id}>
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    ) : ""}
                    <div className="review-rating">
                        Rating: {this.props.data.rating}
                    </div>
                </div>
            </div>
        );
    }
}

export default Review;
export interface ReviewData {
    film: {id: string, name: string},
    user: {id: string, name: string},
    text: string|null,
    rating: string,
    postDate: string
}
