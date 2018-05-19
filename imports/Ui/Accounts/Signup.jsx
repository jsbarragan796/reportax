import React, { Component } from 'react';
import { withHistory, Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let name = document.getElementById("signup-name").value;
        let email = document.getElementById("signup-email").value;
        let password = document.getElementById("signup-password").value;
        let profile = {
            isAdmin: false
        };

        Accounts.createUser({ email: email, username: name, password: password, profile: profile }, (err) => {
            if (err) {
                this.setState({
                    error: err.reason
                });
            } else {
                //this.props.Login();

                Meteor.loginWithPassword(email, password, (err) => {
                    if (err) {
                        this.setState({
                            error: err.reason
                        });
                    } else {
                        //console.log(Meteor.userId());
                        this.props.LogedIn();
                    }
                });
            }
        });
    }

    render() {
        const error = this.state.error;
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="text-center">Sign up</h1>
                    </div>
                    <div className="modal-body">
                        {error.length > 0 ?
                            <div className="alert alert-danger">{error}</div>
                            : ''}
                        <form id="login-form"
                            className="form col-md-12 center-block"
                            onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <input type="text" id="signup-name"
                                    className="form-control input-lg" placeholder="Name" />
                            </div>
                            <div className="form-group">
                                <input type="email" id="signup-email"
                                    className="form-control input-lg" placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <input type="password" id="signup-password"
                                    className="form-control input-lg"
                                    placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <input type="submit" id="login-button"
                                    className="btn btn-lg btn-primary btn-block"
                                    value="Sign Up" />
                            </div>
                            <div className="form-group">
                                <p className="text-center">
                                    Already have an account? Login <a href="#" onClick={() => this.props.Login()}>here</a>
                                </p>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer" style={{ borderTop: 0 }}></div>
                </div>
            </div>
        );
    }
}
export default Signup;