import React from "react";
import {
    useParams
} from "react-router-dom"

interface PersonProps {
    id: string;
}

interface PersonState {

}

class Person extends React.Component<PersonProps, PersonState>{

}

function PersonRouteWrapper() {
    let {id} = useParams();
    return (
        <Person id={id}/>
    );
}

export default PersonRouteWrapper;
