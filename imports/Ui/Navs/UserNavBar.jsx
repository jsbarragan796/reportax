import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "../Css/NavBars.css";

class UserNavBar extends Component {
    constructor(props) {
        super(props);

        this.state = this.getMeteorData();

        this.Buscar = this.Buscar.bind(this);
    }

    getMeteorData() {
        return {
        };
    }

    Buscar() {
        let s = $("#SearchInput").val();
        let t = $("#SearchType").find("option:selected")[0].value;

        //console.log("NavBar | Buscar: ", s, t);
        this.props.Buscar(s, t);
    }

    render() {
        return (
            <nav id="UserNavBar" className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

                <a className="navbar-brand d-flex align-items-center myBrand" href="#">
                    <img src="img/IconRT.png" width="30" height="30" className="d-inline-block align-top" alt="Logo" />
                    <strong>Reportax     </strong>
                </a>
                <div className="input-group mb-3 myInputS">
                    <input id="SearchInput" type="text" className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                    <select className="custom-select mySelectType" id="SearchType">
                        <option value="City">Ciudad</option>
                        <option value="Department">Departamento</option>
                        <option value="Placa">Placa</option>
                    </select>
                    </div>
                    <div className="input-group-append">
                        <button className="btn btn-info" type="button" onClick={this.Buscar}>Buscar</button>
                    </div>
                </div>

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
    Buscar: PropTypes.func.isRequired,
    handleStageChange: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    Logout: PropTypes.func.isRequired,
    UserName: PropTypes.string.isRequired
}

export default UserNavBar;