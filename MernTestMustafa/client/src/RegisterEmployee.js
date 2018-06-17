import React, { Component } from 'react';
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Validation, fieldValidatorCore, validator } from "react-validation-framework";

const CreatePersonMutation = gql`
mutation($userName:String!,$email:String!,$password:String!,$gender:String!,$birthDate:String!) {
    createPerson(userName: $userName,
      email: $email,
      password: $password,
      gender: $gender,
      birthDate: $birthDate) {
      id
      userName
      email
      password
      gender
      birthDate
    }
  }
`;

const CheckIfUserNameUniqueMutation = gql`
mutation($userName:String!) {
    checkIfUserNameUnique(userName: $userName)
}
`;


class Register extends React.Component {
    state = {
        userName: '',
        userNameError: '',
        isUserNameUnique: true,
        email: '',
        password: '',
        gender: '',
        birthDate: '',
        value: 1
    }
    registerPerson = async () => {
        console.log("Hello");
        await this.props.createPerson({
            variables: {
                userName: this.state.userName,
                email: this.state.email,
                password: this.state.password,
                gender: this.state.gender,
                birthDate: this.state.birthDate
            }
            //todo Show Result
        });
    }
    CheckIfErrorNameIsUnique = async (userName) => {
        await this.props.checkIfUserNameUnique({
            variables: {
                userName: userName
            }, update: (store, data) => {
                if (data.data.checkIfUserNameUnique == false) {
                   console.log(store);
                   console.log(data);
                }
            }
        });
    }
    render() {
        return (


            <div style={{ display: "flex" }}>
                <form style={{ margin: "auto" }}>
                    <Paper>

                        <TextField
                            id="userName"
                            label="User Name"
                            margin="normal"
                            fullWidth
                            helperText={this.state.isUserNameUnique === false ? this.state.userNameError : ""}
                            onChange={(e) => {
                                let err2 =  this.CheckIfErrorNameIsUnique(e.target.value);
                                console.log(err2);
                                if (err2 == false) {
                                    console.log(this.form);
                                    this.setState({
                                        isUserNameUnique: false,
                                        userNameError: "Wololo"
                                    });
                                    this.form.validate();
                                } 
                                this.setState({
                                    userName: e.target.value

                                })
                            }}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            margin="normal"
                            fullWidth
                            onChange={(e) => {
                                this.setState({
                                    password: e.target.value
                                })
                            }}
                        />
                        <TextField
                            id="Email"
                            label="Email"
                            type="email"
                            margin="normal"
                            fullWidth
                            onChange={(e) => {
                                this.setState({
                                    email: e.target.value
                                })
                            }}
                        />
                        <TextField
                            id="gender"
                            select
                            label="gender"
                            SelectProps={{
                                native: true,
                            }}
                            margin="normal"
                            fullWidth
                            onChange={(e) => {
                                this.setState({
                                    gender: e.target.value
                                })
                            }}
                        />
                        <TextField
                            id="date"
                            label="BirthDate"
                            type="date"
                            SelectProps={{
                                native: true,
                            }}
                            margin="normal"
                            fullWidth
                            onChange={(e) => {
                                this.setState({
                                    birthDate: e.target.value
                                })
                            }}
                        />
                        <Button variant="contained" size="medium" color="primary" onClick={() => this.registerPerson()}>
                            Medium
                         </Button>
                    </Paper>
                </form>
            </div>
        )

    }

}
export default compose(
    graphql(CreatePersonMutation, { name: "createPerson" }),
    graphql(CheckIfUserNameUniqueMutation, { name: "checkIfUserNameUnique" })
)(Register)