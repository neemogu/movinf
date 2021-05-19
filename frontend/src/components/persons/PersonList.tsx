import React from "react";

import "./PersonList.css"
import "./Person.css"
import PersonListElement, {PersonData} from "./PersonListElement";

interface PersonListProps {
    persons: PersonData[],
    canEdit: boolean
}

class PersonList extends React.Component<PersonListProps>{
    render() {
        return (
            <div className="person-list-content">
                {this.props.persons.map((person) => {
                    return (<PersonListElement canEdit={this.props.canEdit} key={person.id} personData={person}/>)
                })}
            </div>
        );
    }
}

export default PersonList;
