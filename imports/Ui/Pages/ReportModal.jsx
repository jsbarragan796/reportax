import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from "moment/moment";

class ReportModal extends Component {
    constructor(props) {
        super(props);

        this.state = this.getMeteorData();

        this.CargarImagenes = this.CargarImagenes.bind(this);
    }

    getMeteorData() {
        return {
        };
    }

    CargarImagenes(Imagenes) {
        let res = <h5>No hay imagenes disponibles...</h5>

        //console.log("CargarImagenes :", Imagenes);

        if (Imagenes && Imagenes.length > 0) {
            //console.log("CargarImagenes | Hay imagenes, cargando...");
            res = (
                <div id="ReportImagesCarousel" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">

                        {Imagenes.map((d, i) => {
                            let active = (i == 0) ? " active" : "";

                            return (<div key={"Img" + i} className={"carousel-item" + active}>
                                <img className="d-block w-100" src={d.image} alt="First slide" />
                            </div>)
                        })}

                    </div>

                    <a className="carousel-control-prev" href="#ReportImagesCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Anterior</span>
                    </a>

                    <a className="carousel-control-next" href="#ReportImagesCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Siguiente</span>
                    </a>
                </div>
            );
        }

        return res;
    }

    render() {
        let Report = this.props.Report;

        let res = <h1>Loading...</h1>;
        //console.log("Report modal | Report: ", Report);

        if (Report) {
            res = (
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{"Reporte por " + Report.userName + " - " + moment(Report.creationDate).format("DD-MM-YYYY")}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body totalHeight">
                        <h6>{"Departamento: " + Report.Department}</h6>
                        <h6>{"Ciudad: " + Report.City}</h6>
                        <h6>{"Conductor: " + Report.Conductor}</h6>
                        <h6>{"Placa del vehiculo: " + Report.Placa}</h6>
                        <hr className="my-2" />
                        <p>{Report.Denuncia}</p>
                        <hr className="my-2" />
                        {this.CargarImagenes(Report.Images)}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            );
        }

        return (
            <div id="ReportModal" className="modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog reportModal" role="document">
                    {res}
                </div>
            </div>
        );
    }
}

ReportModal.propTypes = {
    Report: PropTypes.object.isRequired
}

export default ReportModal;