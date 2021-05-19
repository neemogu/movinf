import React from "react";

import "./FilmList.css"
import "./Film.css"
import FilmListElement from "./FilmListElement";
import {FilmData} from "./FilmListElement"

interface FilmListProps {
    films: FilmData[],
    canEdit: boolean
}


class FilmList extends React.Component<FilmListProps>{
    render() {
        return (
            <div className="film-list-content">
                {this.props.films.map((film) => {
                    return (<FilmListElement canEdit={this.props.canEdit} key={film.id} filmData={film}/>)
                })}
            </div>
        );
    }
}

export default FilmList;
