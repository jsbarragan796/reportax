import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from "moment/moment";
import * as d3 from "d3";

class ReportsView extends Component {
    constructor(props) {
        super(props);

        this.state = this.getMeteorData();
        this.ClickReport = this.ClickReport.bind(this);
        this.GenerarLista = this.GenerarLista.bind(this);
    }

    getMeteorData() {
        return {
        };
    }

    GenerarLista() {
        let lastReports = this.props.LastReports;
        let reports = this.props.Reports;
        let lista = <h1>Loading...</h1>
        let me = this;

        if (reports && lastReports) {
            var timeFmt = d3.timeParse("%Y-%m-%d %H:%M:%S");
            let active = "";
            var today = moment();
            var past = "";
            var m = moment;
            //console.log("LastReports | ", lastReports);

            function loadReports() {
                return lastReports.map((d, i) => (
                    isTweet = (d.screenName) ? true : false,
                    active = i == 0 ? " active" : "",
                    fDate = (/^\d/.test(d.creationDate)) ? date = timeFmt(d.creationDate) : d.creationDate,
                    past = moment(fDate),
                    dias = (-1 * past.diff(today, 'days')),
                    horas = (-1 * past.diff(today, 'hours')),
                    minutos = (-1 * past.diff(today, 'minutes')),
                    segundos = (-1 * past.diff(today, 'seconds')),
                    //console.log("Difference | ", dias, horas, minutos, today, past),
                    par = (i % 2 != 0) ? " secondary-list-item" : "",
                    final = (dias == 0) ? (horas == 0 ? (minutos == 0 ? segundos + " segundos" : minutos + " minutos") : horas + " horas") : dias + " días",
                    final = moment(fDate).locale("es").fromNow(),
                    <a key={"Report" + i} className={"list-group-item list-group-item-action flex-column align-items-start" + par}>

                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{d.Placa}</h5>
                            <small>{"" + final}</small>
                        </div>
                        <hr className="my-1" />
                        {isTweet ?
                            ""
                            :
                            <h6>{"Conductor: " + d.Conductor}</h6>
                        }

                        {isTweet ?
                            ""
                            :
                            <h6>{"Empresa: " + d.Company}</h6>
                        }

                        <div className="row">
                            <div className="col-10">
                                <p className="mb-1">{d.Denuncia}</p>

                                <hr className="my-1" />

                                <h5 className="noMargin">{d.userName}</h5>

                                {isTweet ?
                                    <small>{"@" + d.screenName}</small>
                                    :
                                    ""
                                }

                            </div>
                            <div className="col-2">
                                <button type="button" className="btn btn-info btnVer" onClick={me.ClickReport} name={d._id} data-toggle="modal" data-target="#ReportModal">Ver</button>
                            </div>
                        </div>
                    </a>
                ));
            }

            lista = (
                <div id="ReportsList" className="list-group">
                    {loadReports()}
                </div>
            );
        }

        return lista;
    }

    ClickReport(e) {
        let target = e.target;
        let reportId = target.name;

        //console.log("Click report | data: ", target, reportId);

        if (reportId) {
            this.props.OpenReport(reportId);
        }
    }


    render() {
        return (
            <div id="ReportsTab">
                {this.GenerarLista()}
            </div>
        );
    }
}

ReportsView.propTypes = {
    LastReports: PropTypes.array.isRequired,
    OpenReport: PropTypes.func.isRequired,
    Reports: PropTypes.array.isRequired
}

export default ReportsView;