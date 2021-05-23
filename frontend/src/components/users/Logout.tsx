import {backLink} from "../Utility";

export function logout() {
    const requestOptions = {
        method: 'POST'
    };
    fetch(backLink + '/logout', requestOptions);
}
