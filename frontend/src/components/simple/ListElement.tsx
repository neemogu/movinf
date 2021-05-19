import React from "react";
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";

import "./List.css"

interface ListElementProps {
    id: string
    name: string,
    canEdit: boolean,
    link: string
}

class ListElement extends React.Component<ListElementProps> {
    render() {
        return (
            <div className="entity-list-element">
                <div className="entity-name-div">
                    {this.props.canEdit ? (
                        <span className="entity-edit">
                            <Button size="small">
                                <Link to={this.props.link + "/edit/" + this.props.id}>
                                    Edit
                                </Link>
                            </Button>
                        </span>
                    ) : ""}
                    <h2 className="entity-name">
                        <Link to={this.props.link + "/" + this.props.id} >
                            {this.props.name}
                        </Link>
                    </h2>

                </div>
            </div>
        );
    }
}

export default ListElement;
