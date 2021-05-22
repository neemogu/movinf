import React from "react";
import {
    Pagination
} from "@material-ui/lab"
import "./ReviewList.css"
import Review from "./Review";
import {ReviewData} from "./Review";
import {Button, MenuItem, TextField} from "@material-ui/core";
import {useParams} from "react-router-dom";

import {convertDate} from "../Utility";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {backLink} from "../Utility";

interface ReviewListProps {
    canEditOrAdd: boolean,
    known: "film"|"user",
    id: string,
    currentUserId: string|null
}

interface ReviewListState {
    reviews: ReviewData[],
    filters: ReviewFilters,
    pagesTotal: number,
    currentPage: number,
    error: any,
    isLoaded: boolean
}

interface ReviewFilters {
    postDateFrom: Date,
    postDateTo: Date,
    ratingFrom: string,
    ratingTo: string,
    sortBy: string,
    sortDir: string
}

class FilterableReviewList extends React.Component<ReviewListProps, ReviewListState>{
    pageSize = "4";
    sortByList = [
        {name: "Rating", value: "rating"},
        this.props.known === "film" ? {name: "Username", value: "username"} : {name: "Film title", value: "title"},
        {name: "Post date", value: "postDate"},
    ];
    sortDirList = [{name: "None", value: "-"}, {name: "Ascending", value: "asc"}, {name: "Descending", value: "desc"}]

    constructor(props: ReviewListProps) {
        super(props);
        this.state = {
            reviews: [],
            filters: {
                postDateFrom: new Date("1900-01-01"),
                postDateTo: new Date("2100-01-01"),
                ratingFrom: "1",
                ratingTo: "10",
                sortBy: this.sortByList[0].value,
                sortDir: this.sortDirList[0].value
            },
            pagesTotal: 0,
            currentPage: 1,
            error: null,
            isLoaded: false
        };
        this.changePage = this.changePage.bind(this);
        this.updateList = this.updateList.bind(this);
        this.getUrlParams = this.getUrlParams.bind(this);
        this.handlePostDateFromChange = this.handlePostDateFromChange.bind(this);
        this.handlePostDateToChange = this.handlePostDateToChange.bind(this);
        this.handleRatingFromChange = this.handleRatingFromChange.bind(this);
        this.handleRatingToChange = this.handleRatingToChange.bind(this);
        this.handleSortByChange = this.handleSortByChange.bind(this);
        this.handleSortDirChange = this.handleSortDirChange.bind(this);
    }

    getUrlParams(page: number|null) {
        return "pageSize=" + this.pageSize +
            (page !== null ? "&pageNum=" + (page - 1) : "") +
            "&ratingFrom=" + this.state.filters.ratingFrom +
            "&ratingTo=" + this.state.filters.ratingTo +
            "&postDateFrom=" + convertDate(this.state.filters.postDateFrom) +
            "&postDateTo=" + convertDate(this.state.filters.postDateTo) +
            "&sortBy=" + this.state.filters.sortBy +
            (this.state.filters.sortDir !== "-" ? "&sortDirection=" + this.state.filters.sortDir : "");
    }

    changePage(event: object, page: number) {
        const params = this.getUrlParams(page);
        fetch(backLink + "/reviews/" + this.props.known + "/" + this.props.id  + "?" + params)
            .then(response => response.json())
            .then(data => this.setState({
                reviews: data.map(function (review: any) {
                    console.log(review);
                    return {
                        film: {id: review.film.id, name: review.film.title},
                        user: {id: review.user.id, name: review.user.username},
                        text: review.text,
                        postDate: review.postDate,
                        rating: review.rating
                    }
                }),
                isLoaded: true,
                currentPage: page
            }), error => {
                this.setState({
                    error: error,
                    isLoaded: true
                })
            });
    }

    updateList(event: any) {
        const params = this.getUrlParams(null);
        fetch(backLink + "/reviews/" + this.props.known + "/" + this.props.id + "/pages?" + params)
            .then(response => response.text())
            .then(data => this.setState({pagesTotal: parseInt(data)}), error => {
                this.setState({
                    error: error,
                    isLoaded: true
                })
            });
        this.changePage({}, 1)
    }

    componentDidMount() {
        this.updateList({});
    }

    handlePostDateFromChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, productionDateFrom: date }}));
    }

    handlePostDateToChange(date: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, productionDateTo: date }}));
    }

    handleRatingFromChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, ratingFrom: event.target.value }}));
    }

    handleRatingToChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, ratingTo: event.target.value }}));
    }

    handleSortByChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, sortBy: event.target.value }}));
    };

    handleSortDirChange(event: any) {
        this.setState(prevState => ({filters: { ...prevState.filters, sortDir: event.target.value }}));
    };

    render() {
        if (this.state.error) {
            return (<div>Error occurred, try to refresh a page</div>);
        }
        if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading...</h1>);
        }
        return (
            <div className="review-list">
                <div className="review-list-title-div">
                    <h1 className="review-list-title">
                        {this.state.reviews.length > 0 ?
                            ("Reviews of " + this.props.known + " '" + this.state.reviews[0][this.props.known].name + "'")
                        : "There are no reviews yet..."}
                    </h1>
                </div>
                <div className="review-list-filter-toolbar">
                    <div className="review-list-filter-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                label="Post date from"
                                value={this.state.filters.postDateFrom}
                                placeholder="01/01/1900"
                                onChange={date => this.handlePostDateFromChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                size="small"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="film-list-filter-container">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="inline"
                                inputVariant="outlined"
                                clearable
                                label="Post date to"
                                value={this.state.filters.postDateTo}
                                placeholder="01/01/2100"
                                onChange={date => this.handlePostDateToChange(date)}
                                format="dd/MM/yyyy"
                                autoOk
                                size="small"
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="review-list-filter-container">
                        <TextField label="Rating from"
                                   type="number"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   inputProps={{
                                       step: 1,
                                       min: 1,
                                       max: 10
                                   }}
                                   variant="outlined"
                                   value={this.state.filters.ratingFrom}
                                   onChange={this.handleRatingFromChange}
                                   size="small"
                        />
                    </div>
                    <div className="review-list-filter-container">
                        <TextField label="Rating to"
                                   type="number"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   inputProps={{
                                       step: 1,
                                       min: 1,
                                       max: 10
                                   }}
                                   variant="outlined"
                                   value={this.state.filters.ratingTo}
                                   onChange={this.handleRatingToChange}
                                   size="small"
                        />
                    </div>
                    <div className="review-list-filter-container">
                        <TextField select
                                   label="Sort by"
                                   variant="outlined"
                                   value={this.state.filters.sortBy}
                                   onChange={this.handleSortByChange}
                                   size="small"
                        >
                            {this.sortByList
                                .map(sortColumn => (
                                    <MenuItem key={sortColumn.value} value={sortColumn.value}>
                                        {sortColumn.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="review-list-filter-container">
                        <TextField select
                                   label="Sort direction"
                                   variant="outlined"
                                   value={this.state.filters.sortDir}
                                   onChange={this.handleSortDirChange}
                                   size="small"
                        >
                            {this.sortDirList
                                .map(sortDir => (
                                    <MenuItem key={sortDir.value} value={sortDir.value}>
                                        {sortDir.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                    <div className="review-list-filter-submit">
                        <Button onClick={this.updateList}>
                            Search
                        </Button>
                    </div>
                </div>
                <div className="review-list-pages">
                    <Pagination page={this.state.currentPage} defaultPage={1} boundaryCount={3}
                                count={this.state.pagesTotal} onChange={this.changePage}/>
                </div>
                <div className="review-list-content">
                    {this.state.reviews.map(review => (
                        <Review data={review} known={this.props.known}
                                canEdit={this.props.canEditOrAdd ||
                                (this.props.currentUserId !== null && review.user.id == this.props.currentUserId)}/>
                    ))}
                </div>
                <div className="review-list-pages">
                    <Pagination page={this.state.currentPage} defaultPage={1} boundaryCount={3}
                                count={this.state.pagesTotal} onChange={this.changePage}/>
                </div>
            </div>
        );
    }
}

function FilterableReviewListRouteWrapper(props: {canEditOrAdd: boolean, known: "film"|"user", currentUserId: string|null}) {
    const {id} = useParams();
    return (
        <FilterableReviewList canEditOrAdd={props.canEditOrAdd} known={props.known}
                              id={id} currentUserId={props.currentUserId}/>
    );
}

export default FilterableReviewListRouteWrapper;
