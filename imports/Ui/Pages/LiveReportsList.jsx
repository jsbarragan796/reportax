import React, { Component } from 'react';
import { withTracker } from "meteor/react-meteor-data";
import * as moment from "moment/moment";
import * as d3 from "d3";

import { Reports } from "../../Api/Reports";

class LiveReportsList extends Component {
    constructor(props) {
        super(props);

        this.state = this.getMeteorData();

        this.CalculateDays = this.CalculateDays.bind(this);
        this.RenderReports = this.RenderReports.bind(this);
    }

    getMeteorData() {
        return {
            isAuthenticated: Meteor.userId() !== null,
            stage: "Home"
        };
    }

    CalculateDays(date) {
        console.log("Calculate Days | ", date);

        var a = moment(date).format('DD/MM/YYYY');
        var b = moment(new Date()).format('DD/MM/YYYY');
        var days = b.diff(a, 'days');
    }

    RenderReports() {
        let data = this.props.reports;
        console.log("Render reports | ", data);

        let res =
            data.map((d) => (
                <a href="#" class="list-group-item list-group-item-action flex-column align-items-start active">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">List group item heading</h5>
                        <small>{this.calculateDays(d.date) + " days ago"}</small>
                    </div>
                    <p class="mb-1">{d.report}</p>
                    <small>Donec id elit non mi porta.</small>
                </a>
            ));
        return (res);
    }

    render() {
        return (
            <div id="LiveReportsList" className="col-md-6">
                <h2>Last reports</h2>
                <hr className="my-2" />

                <div className="list-group">

                </div>
            </div>
        );
    }
}
export default withTracker(
    () => {
        Meteor.subscribe('Reports');

        return {
            reports: Reports.find({}).fetch()
        }
    }
)(LiveReportsList);