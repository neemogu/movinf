import React from "react";
import "./UserList.css"
import "./User.css"
import {strOrGap} from "../Utility"
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";

interface UserListElementProps {
    userData: UserData,
    canEdit: boolean
}

class UserListElement extends React.Component<UserListElementProps> {
    render() {
        return (
            <div className="user-list-element">
                <div className="user-username-div">
                    <h2 className="user-username">
                        <Link to={"/users/" + this.props.userData.id} >
                            {this.props.userData.username}
                        </Link>
                    </h2>
                </div>
                <div className="user-list-element-about">
                    <table className="user-about-table">
                        <tr className="user-about-table-row">
                            <th className="user-about-table-name">Firstname</th>
                            <th className="user-about-table-values">
                                {strOrGap(this.props.userData.firstname)}
                            </th>
                        </tr>
                        <tr className="user-about-table-row">
                            <th className="user-about-table-name">Lastname</th>
                            <th className="user-about-table-values">
                                {strOrGap(this.props.userData.lastname)}
                            </th>
                        </tr>
                        <tr className="user-about-table-row">
                            <th className="user-about-table-name">Email</th>
                            <th className="user-about-table-values">
                                {this.props.userData.email}
                            </th>
                        </tr>
                    </table>
                    {this.props.canEdit ? (
                        <span className="user-edit">
                            <Button size="small">
                                <Link to={"/users/edit/" + this.props.userData.id}>
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

export default UserListElement;
export interface UserData {
    id: string,
    username: string,
    firstname: string|null,
    lastname: string|null,
    email: string
}
