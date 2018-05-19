import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from "meteor/react-meteor-data";

import "../Css/App.css";

// Admin
import Dashboard from "../Admin/Dashboard.jsx";

// Data
import { Companies } from "../../Api/Companies.js";
import { Reports } from "../../Api/Reports.js";
import { TweetsReports } from "../../Api/TweetsReports.js";

//Components 
import ApisTester from "./ApisTester.jsx";
import UserNavBar from "../Navs/UserNavBar.jsx";

import BasicMenu from '../Pages/BasicMenu.jsx';
import BasicStatistics from "../Pages/BasicStatistics.jsx";

import ColombiaMap from '../D3/ColombiaMap.jsx';
import LiveReportsList from '../Pages/LiveReportsList';

import ReportModal from '../Pages/ReportModal';
import ReportForm from '../Pages/ReportForm';
import TwitterView from '../Pages/TwitterView';

/*
My Colors:
#B2A418
#FFEF55
#FFEC3C
#2E06B2
#693CFF
==========
#B2AB30
#78DAFF
#FFF6SE
#CC3757
#B23953
*/

class App extends Component {
    constructor(props) {
        super(props);

        this.state = this.getMeteorData();

        this.BackHome = this.BackHome.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStageChange = this.handleStageChange.bind(this);
        this.Logout = this.Logout.bind(this);
        this.OpenReport = this.OpenReport.bind(this);
        this.CreateReport = this.CreateReport.bind(this);
    }

    getMeteorData() {
        return {
            isAuthenticated: Meteor.userId() !== null,
            //stage: "CREATE_REPORT"
            actReport: {},
            stage: "Home"
        };
    }

    componentDidMount() {
    }

    componentWillMount() {
        if (!this.state.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    Logout(e) {
        //console.log("App | Log out");

        e.preventDefault();
        Meteor.logout((err) => {
            if (err) {
                console.log(err.reason);
            } else {
                this.props.history.push('/');
            }
        });
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleStageChange(event) {
        //console.log("App | HandleStageChange: ", event);
        this.setState({ stage: event.target.name });
    }

    BackHome() {
        this.setState({
            stage: "Home"
        });
    }

    

    GetStage(user) {
        let actStage = this.state.stage;
        let svgWidth = $("#App").width();
        //console.log("Map size | ", svgWidth);
        let TweetReports = this.props.TweetReports;
        let Reports = this.props.reports;
        let LastReports = this.props.lastReports;

        if (actStage === "Home") {
            return (
                <div id="BasicInit">
                    <UserNavBar handleStageChange={(e) => this.handleStageChange(e)} isAdmin={user.profile.isAdmin} Logout={this.Logout} UserName={this.props.user.username} />

                    <div className="container navMargin">
                        <div className="row justify-content-center myBtnRow">
                            <div className="col-6">
                                <div id="Alers">
                                    <div id="created-alert" className="alert alert-success noMarginContainer" role="alert" style={{ display: "none" }}>
                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        ¡Reporte creado!
                                    </div>

                                    <div id="created-alert" className="alert alert-success noMarginContainer" role="alert" style={{ display: "none" }}>
                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        ¡Reporte creado!
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <button className="btn btn-success btnReport" name="CREATE_REPORT" onClick={this.handleStageChange}>Reportar</button>
                            </div>
                        </div>

                        <div className="row myRow">

                            {/*<BasicMenu />*/}
                            {/*<LiveReportsList />*/}

                            {/*<div id="LiveReportsList" className="col-md-6">
                                <BasicStatistics />
                            </div>

                            <div id="MapCol" className="col-md-6">
                                <h2>Reports Map</h2>
                                <hr className="my-2" />

                                <ColombiaMap
                                    width="600"
                                    height="600"
                                    //data={{ RISARALDA: 10 }}
                                    data={{}}
                                ></ColombiaMap>
            </div>*/}
                            {/*console.log("Creando Basic Statistics: ", TweetReports)*/}
                            {Reports && LastReports ? <BasicStatistics isAdmin={user.profile.isAdmin} LastReports={LastReports} Reports={Reports} TweetReports={TweetReports} OpenReport={(rI) => this.OpenReport(rI)} /> : <h1>Loading...</h1>}
                        </div>
                    </div>
                </div>
            );
        } else if (actStage === "ADMINDashboard") {
            let res = Reports ? <Dashboard BackHome={this.BackHome} Reports={Reports} /> : <h1>Loading</h1>;
            return (
                res
            );
        } else if (actStage === "CREATE_REPORT") {
            return (
                <div id="CreateReportStage">
                    <UserNavBar handleStageChange={(e) => this.handleStageChange(e)} isAdmin={user.profile.isAdmin} Logout={this.Logout} UserName={this.props.user.username} />

                    <div className="navMargin container">
                        <ReportForm BackHome={this.BackHome} Companies={this.props.companies} CreateReport={this.CreateReport} />
                    </div>
                </div>
            );
        }
    }

    CreateReport(CompanyCheck, SelectedDep, Department, SelectedCity, City, PlacaInput, DenunciaInput, Images, ConductorInput, SelectedCompany, FinalCompany) {
        /*console.log("App | CreateReport | Arrays: ", SelectedDep, Department, SelectedCity, City);
        console.log("App | CreateReport | Placa-Denuncia: ", PlacaInput, DenunciaInput);
        console.log("App | CreateReport | Imagenes: ", Images);
        console.log("App | CreateReport | Conductor: ", ConductorInput);
        console.log("App | CreateReport | Company", CompanyCheck, SelectedCompany, FinalCompany);*/

        Meteor.call("Reports.addReport", CompanyCheck, SelectedDep, Department, SelectedCity, City, PlacaInput, DenunciaInput, Images, ConductorInput, SelectedCompany, FinalCompany, (err, res) => {
            if (err) {
                throw err;
            } else {
                this.setState({
                    stage: "Home"
                });

                $('#created-alert').show();
            }
        });
    }

    OpenReport(reportId) {
        let reports = this.props.reports;
        let reportData = {};

        //console.log("Reports | ", reports);

        if (reports) {
            for (let i = 0; i < reports.length; i++) {
                let act = reports[i];
                //console.log("Act Report | ", act, reportId);

                if (act._id == reportId) {
                    reportData = reports[i];
                }
            }

            console.log("App | OpenReport", reportData);

            this.setState({
                actReport: reportData
            });
        }
    }

    CloseReport() {
        $('#LogModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    render() {
        //console.log("User: ", this.props.user);
        //console.log("App | ReportsList ", this.props.reports);

        let user = this.props.user;

        let LoadingContent = (
            <h1>Loading...</h1>
        );

        let MyContent = this.props.user ? (
            <div id="App">
                <ReportModal Report={this.state.actReport} />
                {this.GetStage(user)}

                {/*<footer className="footer">
                    <div className="container">
                        <span className="text-muted">Place sticky footer content here.</span>
                    </div>
        </footer>*/}
            </div >
        ) : LoadingContent;

        return MyContent;
    }
}

App.propTypes = {
}

export default withTracker(
    () => {
        Meteor.subscribe('Companies');
        Meteor.subscribe('Reports');
        Meteor.subscribe('TweetsReports');
        Meteor.subscribe('users');

        return {
            companies: Companies.find({}).fetch(),
            reports: Reports.find({}).fetch(),
            TweetReports: TweetsReports.find(
                {},
                {
                    sort: { creationDate: -1 },
                    limit: 20
                }).fetch(),
            lastReports: Reports.find(
                {},
                {
                    sort: { creationDate: -1 },
                    limit: 10
                }
            ).fetch(),
            user: Meteor.user()
        }
    }
)(App);