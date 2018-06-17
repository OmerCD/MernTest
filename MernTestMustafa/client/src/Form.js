import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {
    state = {
        text: ''
    }
    handleChange = (e) => {
        const newText = e.target.value
        this.setState({
            text: newText
        });
    };
    handleKeyDown = e => {
        if (e.key === "Enter") {
            this.props.submit(this.state.text);
        }
    };
    render() {
        const { text } = this.state.text;
        return (
            <form>
                <TextField
                    id="name"
                    label="To do .."
                    margin="normal"
                    fullWidth
                    value={text}
                    onChange={this.handleChange}
                    onKeyDown= {this.handleKeyDown}
                />
            </form>
        );
    }
}