import * as React from 'react';

interface Message {
    msg: string;
}

interface MessageProps {}

class HelloMessage extends React.Component<MessageProps, Message> {
    constructor(props: MessageProps) {
        super(props);
        this.state = {
            msg: 'Hello'
        };
    }

    componentDidMount() {
        fetch('http://localhost:8080/')
            .then(response => response.json())
            .then(data => this.setState({msg: data}))
            .catch(error => console.error(error));
    }

    render() {
        const msg = this.state.msg;
        return (
            <span>
                {msg} <br/>
            </span>
        );
    }
}

export default HelloMessage;