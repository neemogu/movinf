import React from "react";
import "./List.css"
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom"
import ListElement from "./ListElement";

import {backLink} from "../Utility";

interface ListProps {
    canEditOrAdd: boolean,
    link: string
}

interface ListState {
    entities: {id: string, name: string}[],
    error: any,
    isLoaded: boolean
}

class List extends React.Component<ListProps, ListState>{
    constructor(props: ListProps) {
        super(props);
        this.state = {
            entities: [],
            error: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        fetch(backLink + this.props.link)
            .then(response => response.json())
            .then(data => this.setState({
                entities: data.list,
                isLoaded: true
                }), error => this.setState({
                    error: error,
                    isLoaded: true
                }));
    }

    componentDidUpdate(prevProps: Readonly<ListProps>, prevState: Readonly<ListState>, snapshot?: any) {
        if (prevProps.link !== this.props.link) {
            this.componentDidMount();
        }
    }

    render() {
        if (this.state.error) {
            return (<div>Error occurred, try to refresh a page</div>);
        }
        if (!this.state.isLoaded) {
            return (<h1 className="loading">Loading...</h1>);
        }
        return (
            <div className="entity-list">
                {this.props.canEditOrAdd ? (
                    <div className="entity-list-add">
                        <Button>
                            <Link to={this.props.link + "/new"}>
                                Add new
                            </Link>
                        </Button>
                    </div>
                ) : ""}
                <div className="entity-list-content">
                    {this.state.entities.map((entity) => {
                        return (<ListElement canEdit={this.props.canEditOrAdd} key={entity.id} id={entity.id}
                                             name={entity.name} link={this.props.link}/>)
                    })}
                </div>
            </div>
        );
    }
}



export default List;



