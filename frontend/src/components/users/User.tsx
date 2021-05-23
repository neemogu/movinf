import * as React from 'react';
import {
    useParams,
    Link
} from "react-router-dom";
import Review from "../reviews/Review"
import {ReviewData} from "../reviews/Review";
import "./User.css"

import {strOrGap} from "../Utility";
import {Button} from "@material-ui/core";
import {backLink} from "../Utility";

interface UserProps {
    id: string,
    canEdit: boolean,
    currentUserId: string|null
}

interface UserData {
    username: string,
    firstname: string|null,
    lastname: string|null,
    email: string,
    birthdate: string|null,
    registrationDate: string,
    gender: string
    reviews: ReviewData[],
    reviewsCount: string
}

interface UserState {
    data: UserData,
    error: any,
    isLoaded: boolean
}

class User extends React.Component<UserProps, UserState> {
    constructor(props : UserProps) {
        super(props);
        this.state = {
            data: {
                username: '',
                firstname: null,
                lastname: null,
                email: '',
                birthdate: null,
                registrationDate: '',
                gender: 'Male',
                reviews: [],
                reviewsCount: '0'
            },
            error: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        fetch(backLink + "/users/" + this.props.id)
            .then(response => response.json())
            .then(received => this.setState({
                data: {
                    username: received.user.username,
                    firstname: received.user.firstname,
                    lastname: received.user.lastname,
                    email: received.user.email,
                    birthdate: received.user.birthdate,
                    registrationDate: received.user.registrationDate,
                    gender: received.user.gender,
                    reviewsCount: received.reviewsCount,
                    reviews: received.reviews.map(function (review : any) {
                        return {
                            user: {id: review.user.id, name: review.user.username},
                            film: {id: review.film.id, name: review.film.title},
                            postDate: review.postDate,
                            text: review.text,
                            rating: review.rating
                        }
                    }),
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
            return (<h1>Error: {this.state.error.message}</h1>)
        } else if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading...</h1>)
        } else {
            return (
                <div className="user">
                    <div className="user-username-div">
                        <h1 className="user-username">
                            {this.state.data.username}
                        </h1>
                        {this.props.canEdit || this.props.currentUserId == this.props.id ? (
                            <span className="user-edit">
                                <Button size="small">
                                    <Link to={"/users/edit/" + this.props.id}>
                                        Edit
                                    </Link>
                                </Button>
                            </span>
                        ) : ""}
                    </div>
                    <div className="user-about-div">
                        <div className="user-about">
                            <h2>About: </h2>
                            <table className="user-about-table">
                                <tr className="user-about-table-row">
                                    <th className="user-about-table-name">Firstname</th>
                                    <th className="user-about-table-values">
                                        {strOrGap(this.state.data.firstname)}
                                    </th>
                                </tr>
                                <tr className="user-about-table-row">
                                    <th className="user-about-table-name">Lastname</th>
                                    <th className="user-about-table-values">
                                        {strOrGap(this.state.data.lastname)}
                                    </th>
                                </tr>
                                <tr className="user-about-table-row">
                                    <th className="user-about-table-name">Email</th>
                                    <th className="user-about-table-values">
                                        {this.state.data.email}
                                    </th>
                                </tr>
                                <tr className="user-about-table-row">
                                    <th className="user-about-table-name">Gender</th>
                                    <th className="user-about-table-values">
                                        {this.state.data.gender}
                                    </th>
                                </tr>
                                <tr className="user-about-table-row">
                                    <th className="user-about-table-name">Birthdate</th>
                                    <th className="user-about-table-values">
                                        {strOrGap(this.state.data.birthdate)}
                                    </th>
                                </tr>
                                <tr className="user-about-table-row">
                                    <th className="user-about-table-name">Registration date</th>
                                    <th className="user-about-table-values">
                                        {this.state.data.registrationDate}
                                    </th>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="user-reviews-div">
                        <h2 className="user-reviews-title">
                            Reviews
                        </h2>
                        <span className="user-review-count">
                            {parseInt(this.state.data.reviewsCount) !== 0 ?
                                (<Link to={"/reviews/user/" + this.props.id}>
                                    {"(" + this.state.data.reviewsCount + " reviews)"}
                                </Link>) : ""}
                        </span>
                        {this.state.data.reviews.map((review) =>
                            (<Review key={review.film.id + " " + this.props.id}
                                     data={review} known="user"
                                     canEdit={this.props.canEdit ||
                                     (this.props.currentUserId !== null && review.user.id == this.props.currentUserId)}/>)
                        )}
                        <div className="user-reviews-view-all">
                            <Button>
                                <Link to={"/reviews/user/" + this.props.id}>
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

function UserRouteWrapper(props: {canEdit: boolean, currentUserId: string|null}) {
    let {id} = useParams();
    return (
        <User id={id} canEdit={props.canEdit} currentUserId={props.currentUserId}/>
    );
}

export default UserRouteWrapper;
