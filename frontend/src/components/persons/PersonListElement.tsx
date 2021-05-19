import React from "react";
import {Link} from "react-router-dom";
import {strOrGap} from "../Utility";
import {Button} from "@material-ui/core";

import "./PersonList.css"

interface PersonListElementProps {
    personData: PersonData,
    canEdit: boolean
}

class PersonListElement extends React.Component<PersonListElementProps> {
    render() {
        return (
            <div className="person-list-element">
                <div className="person-name-div">
                    <h2 className="person-name">
                        <Link to={"/persons/" + this.props.personData.id} >
                            {this.props.personData.firstname + " " + this.props.personData.lastname}
                        </Link>
                    </h2>
                </div>
                <div className="person-list-element-about">
                    <table className="person-about-table">
                        <tr className="person-about-table-row">
                            <th className="person-about-table-name">Birthdate</th>
                            <th className="person-about-table-values">
                                {strOrGap(this.props.personData.birthdate)}
                            </th>
                        </tr>
                        <tr className="person-about-table-row">
                            <th className="person-about-table-name">Country</th>
                            <th className="person-about-table-values">
                                {this.props.personData.country !== null ? this.props.personData.country.name : "-"}
                            </th>
                        </tr>
                    </table>
                    {this.props.canEdit ? (
                        <span className="person-edit">
                            <Button size="small">
                                <Link to={"/persons/edit/" + this.props.personData.id}>
                                    Edit
                                </Link>
                            </Button>
                        </span>
                    ) : ""}
                </div>
            </div>
        );
    }
}

export default PersonListElement;
export interface PersonData {
    id: string,
    firstname: string,
    lastname: string|null,
    birthdate: string|null,
    country: {id: string, name: string}|null
}
