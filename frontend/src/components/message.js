import React from 'react';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: this.props.location.state.message
        }
    }
    render() {
        console.log(this.props.location.state.message);
          
        const divStyle = {
            color: '#14b3db',
            textAlign: 'center',
            marginTop: '30px',
            fontSize: 'large'
        }
        return (
            <div style={divStyle}>
                {this.state.message}
            </div>
        )
    }
}