import React, { Component } from 'react';

import "../Css/Init.css";

//Components
import InitNavBar from "../Navs/InitNavBar.jsx";

// Pages
import Login from "../Accounts/Login.jsx";
import Signup from "../Accounts/Signup.jsx";

class Init extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalStatus: "LOGIN"
        }

        this.Login = this.Login.bind(this);
        this.Signup = this.Signup.bind(this);
        this.LogedIn = this.LogedIn.bind(this);
    }

    Login() {
        //alert("Log in");
        this.setState({
            modalStatus: "LOGIN"
        });
    }

    Signup() {
        //alert("Sign up");
        this.setState({
            modalStatus: "SIGNUP"
        });
    }

    LogedIn() {
        // console.log("Init | LogedIn");

        $('#LogModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        this.props.history.push('/App');
    }


    /*<div id="Init">
        <InitNavBar Login={this.Login} />

        <div id="LogModal" className="modal" tabIndex="-1" role="dialog">
            {this.state.modalStatus == "LOGIN" ? <Login Signup={this.Signup} LogedIn={this.LogedIn} /> : <Signup Login={this.Login} LogedIn={this.LogedIn} history={this.props.history} />}
        </div>

        <div className="container containerMaxWidth">
            <h1>Bienvenido a reporte al Taxi!</h1>

        </div>
</div>*/

    render() {
        return (

            < div id="Init" >
                <InitNavBar Login={this.Login} />

                <div id="LogModal" className="modal" tabIndex="-1" role="dialog">
                    {this.state.modalStatus == "LOGIN" ? <Login Signup={this.Signup} LogedIn={this.LogedIn} /> : <Signup Login={this.Login} LogedIn={this.LogedIn} history={this.props.history} />}
                </div>

                <div className="container myContainer">
                    <div className="row align-items-center tittle">
                        <div className="col align-self-center">
                            <h1>Bienvenido a Reportax, la aplicación web que se encarga de manejar tus denuncias y reportes de taxis en Colombia. </h1>
                        </div>
                    </div>

                    <div className="imageArrow">
                        <img src="img/arrow.png" />
                    </div>
                </div>

                <div className="row introduction">
                    <div className="col align-self-center Reporta">
                        <div className="card myCard">
                            <img className="card-img-top" src="img/reporte.png" alt="Reporta" />
                            <div className="card-body">
                                <h5 className="card-title">Reporta</h5>
                                <p className="card-text">Diligencia el formulario de reportes y denuncias, por medio del cual das conocer la situacion que pasaste. </p>
                            </div>
                        </div>
                    </div>
                    <div className="col align-self-center Busca">
                        <div className="card myCard">
                            <img className="card-img-top" src="img/busque.png" alt="Analiza" />
                            <div className="card-body">
                                <h5 className="card-title">Analiza</h5>
                                <p className="card-text">Revisa las estadisticas y encuentra patrones de comportamientos y situaciones que han llevado a denuncias en diferentes lugares del pais. </p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="text-muted myFooter">
                    <div className="container">
                        <p className="float-right">
                            <a href="#">Back to top</a>
                        </p>
                        <p>All the images are of the free website: <a href="http://www.unsplash.com">Unsplash</a>.</p>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Init;