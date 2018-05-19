import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "../Css/NavBars.css";

class UserNavBar extends Component {
    render() {
        return (
            <nav id="UserNavBar" className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

                <a className="navbar-brand d-flex align-items-center myBrand" href="#">
                    <img src="img/IconRT.png" width="30" height="30" className="d-inline-block align-top" alt="Logo" />
                    <strong>Reportax     </strong>
                </a>
                <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" />

                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        {this.props.isAdmin ? ""
                            : ""}
                    </li>
                </ul>

                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <button className="btn btn-danger btnLogout" onClick={this.props.Logout}>Log out</button>
                    </li>
                </ul>
            </nav>
        );
    }
}


UserNavBar.propTypes = {
    handleStageChange: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    Logout: PropTypes.func.isRequired,
    UserName: PropTypes.string.isRequired
}

export default UserNavBar;