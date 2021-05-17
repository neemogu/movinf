import * as React from 'react';
import "./Review.css"

interface ReviewProps {
    film: {id: string, title: string},
    user: {id: string, username: string},
    text: string|null,
    rating: string,
    postDate: string
}

class Review extends React.Component<ReviewProps> {
    render() {
        return (
            <div className={parseInt(this.props.rating) > 5 ? "review-div-positive" : "review-div-negative"}>
                <div className="review-header">
                    <div className="review-header-username">
                        {this.props.user.username}
                    </div>
                    <div className="review-header-postdate">
                        Posted on {this.props.postDate}
                    </div>
                </div>
                <div className="review-body">
                    <div className="review-text">
                        {this.props.text}
                    </div>
                </div>
                <div className="review-footer">
                    <div className="review-rating">
                        Rating: {this.props.rating}
                    </div>
                </div>
            </div>
        );
    }
}

export default Review;
