import * as React from 'react';

import "./HelloMessage.css"

interface MessageProps {}

class HelloMessage extends React.Component<MessageProps> {
    render() {
        return (
            <div className="hello-message">
                <h1>
                    Welcome!
                </h1>
            </div>
        );
    }
}

export default HelloMessage;
