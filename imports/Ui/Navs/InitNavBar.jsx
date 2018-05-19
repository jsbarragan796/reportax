import React, { Component } from 'react';

import "../Css/NavBars.css";

class InitNavBar extends Component {
    render() {
        return (


            <nav id="InitNavBar" className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

                <a className="navbar-brand d-flex align-items-center myBrand" href="#">
                    <img src="img/IconRT.png" width="30" height="30" className="d-inline-block align-top" alt="Logo" />
                    <strong>Reportax     </strong>
                </a>

                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <button className="btn btn-outline-primary btnLogin" onClick={() => this.props.Login()} href="#" data-toggle="modal" data-target="#LogModal">Log in</button>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default InitNavBar;