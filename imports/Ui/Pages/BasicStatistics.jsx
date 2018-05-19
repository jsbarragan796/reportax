import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DateChart from '../D3/DateChart';
import ReportsView from '../Pages/ReportsView.jsx';

import Dashboard from "../Admin/Dashboard.jsx";
import TwitterView from './TwitterView';

class BasicStatistics extends Component {

    render() {
        let lastReports = this.props.LastReports;
        let reports = this.props.Reports;
        let TweetReports = this.props.TweetReports;

        //console.log("BasicStatistics | Reports: ", reports);

        let content = (
            <div>
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Estadisticas</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Ultimos reportes</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Denuncias Tuiteadas</a>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                        <DateChart Reports={reports} />
                        {/*<Dashboard BackHome={this.BackHome} Reports={reports} />*/}
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                        <ReportsView LastReports={lastReports} OpenReport={(rI) => this.props.OpenReport(rI)} Reports={reports} />
                    </div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <TwitterView isAdmin={this.props.isAdmin} TweetReports={TweetReports} />
                    </div>
                </div>
            </div>

        );

        return (
            <div id="BasicStatistics" className="col">
                {TweetReports && reports && lastReports ?
                    content
                    : <h1>Loading...</h1>}

            </div>
        );
    }
}

BasicStatistics.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    LastReports: PropTypes.array.isRequired,
    OpenReport: PropTypes.func.isRequired,
    Reports: PropTypes.array.isRequired,
    TweetReports: PropTypes.array.isRequired
}

export default BasicStatistics;