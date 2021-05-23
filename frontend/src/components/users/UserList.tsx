import React from "react";

import "./UserList.css"
import "./User.css"
import {UserData} from "./UserListElement"
import UserListElement from "./UserListElement";

interface UserListProps {
    users: UserData[],
    canEdit: boolean
}


class UserList extends React.Component<UserListProps>{
    render() {
        return (
            <div className="user-list-content">
                {this.props.users.map((user) => {
                    return (<UserListElement canEdit={this.props.canEdit} key={user.id} userData={user}/>)
                })}
            </div>
        );
    }
}

export default UserList;
