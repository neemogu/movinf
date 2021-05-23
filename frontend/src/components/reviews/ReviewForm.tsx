import React from "react";
import {
    Button, MenuItem, TextField
} from "@material-ui/core";

import "../films/FilmForm.css"

import {
    useParams,
    Redirect
} from "react-router-dom";
import {Rating} from "@material-ui/lab";
import {backLink} from "../Utility";

interface ReviewFormReviewData {
    film: {id: string},
    user: {id: string},
    text: string|null,
    rating: number,
    postDate: string|null
}

interface ReviewFormState {
    review: ReviewFormReviewData,
    isExist: boolean,
    isLoaded: boolean,
    error: any,
    redirect: boolean
}

interface ReviewFormProps {
    filmId: string,
    userId: string
}

class ReviewForm extends React.Component<ReviewFormProps, ReviewFormState>{
    constructor(props: ReviewFormProps) {
        super(props);
        this.state = {
            review: {
                film: {id: this.props.filmId},
                user: {id: this.props.userId},
                text: '',
                rating: 5,
                postDate: null
            },
            isLoaded: false,
            isExist: false,
            error: {},
            redirect: false
        }
        this.bindHandles = this.bindHandles.bind(this);
        this.bindHandles();
    }

    bindHandles() {
        this.deleteItem = this.deleteItem.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleRatingChange = this.handleRatingChange.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        fetch(backLink + "/reviews/specific?filmId=" + this.props.filmId + "&userId=" + this.props.userId)
            .then(response => {
                if (response.ok) {
                    this.setState({
                        isExist: true
                    });
                    return response.json();
                } else {
                    this.setState({
                        isExist: false
                    });
                    return this.state.review;
                }
            })
            .then(data => {
                this.setState({
                    review: {
                        user: {id: data.user.id},
                        film: {id: data.film.id},
                        text: data.text,
                        rating: parseInt(data.rating),
                        postDate: data.postDate
                    }
                })
            })
        this.setState({isLoaded: true});
    }

    submitForm() {
        const requestOptions = {
            method: !this.state.isExist ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.review)
        };
        fetch(backLink + '/reviews', requestOptions)
            .then(response => {
                if (response.ok) {
                    this.setState({redirect: true});
                } else if (response.status === 409) {
                    this.setState({redirect: true});
                    alert("You has already added a review, please edit an existing");
                }
                else {
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
        fetch(backLink + "/reviews?filmId=" + this.props.filmId + "&userId=" + this.props.userId,
            requestOptions).then(response => response.json());
        this.setState({redirect: true});
    }

    handleTextChange(event: any) {
        this.setState(prevState => ({review: { ...prevState.review, text: event.target.value }}));
    }

    handleRatingChange(event: any, value: number) {
        this.setState(prevState => ({review: { ...prevState.review, rating: value }}));
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={"/films/" + this.props.filmId}/>
        }
        if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading...</h1>);
        }
        return (
            <form className="film-form">
                <div className="form-text-field-container">
                    <span className="form-property-title">Text</span>
                    <div className="form-text-field">
                        <TextField label="Text"
                                   multiline
                                   variant="outlined"
                                   value={this.state.review.text !== null ? this.state.review.text : ''}
                                   onChange={this.handleTextChange}
                                   size="small"
                                   error={this.state.error.text !== undefined}
                                   helperText={this.state.error.text !== undefined ? this.state.error.text : ""}
                        />
                    </div>
                </div>
                <div className="form-text-field-container">
                    <span className="form-property-title">Rating</span>
                    <div className="form-text-field">
                        <Rating
                            name="rating"
                            value={this.state.review.rating}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    this.handleRatingChange(event, newValue);
                                }
                            }}
                            defaultValue={5}
                            max={10}
                            precision={1}
                            size="large"
                        />
                    </div>
                </div>
                <div className="form-submit">
                    <Button onClick={this.submitForm}>
                        Submit
                    </Button>
                    {this.state.isExist ? (
                        <Button className="delete-button" onClick={this.deleteItem}>
                            Delete
                        </Button>
                    ) : <span/>}
                </div>
            </form>
        );
    }
}

function ReviewFormRouteWrapper(props: { currentUserId: string }) {
    let {id} = useParams();
    return (
        <ReviewForm filmId={id} userId={props.currentUserId}/>
    );
}

export default ReviewFormRouteWrapper;
