import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import moment from "moment/moment";

import "../Css/D3Graphs.css";

class DateChart extends Component {
    constructor(props) {
        super(props);

        this.state = this.getMeteorData();
        this.GenerateTimeSeriesChart = this.GenerateTimeSeriesChart.bind(this);
        this.GenerateBarChart = this.GenerateBarChart.bind(this);
    }

    getMeteorData() {
        return {
        };
    }

    componentDidMount() {
        //console.log("DateChart | DidMount");
        this.GenerarGraficas();
    }

    componentDidUpdate() {
        //console.log("DateChart | didUpdate");
        this.GenerarGraficas();
    }

    componentWillUpdate() {
        //console.log("DateChart | WillUpdate");
        this.GenerarGraficas();
    }

    GenerarGraficas() {
        let data = this.props.Reports;
        let string = JSON.stringify(data);
        let jsonn = JSON.parse(string);
        let formatDAte = d3.timeFormat("%Y-%m-%d %H:%M:%S");

        //console.log("DateChart | Reports: ", data);

        //d3.json(jsonn);
        //console.log("DidUpdate | payments: ", payments, dimTotal, total, total.all());

        /*var paymentsByTotal = payments.dimension(function (d) { return d.total; });
        paymentsByTotal.filter([100, 200]); // selects payments whose total is between 100 and 200
        paymentsByTotal.filter(120); // selects payments whose total equals 120
        paymentsByTotal.filter(function (d) { return d % 2; }); // selects payments whose total is odd
        paymentsByTotal.filter(null); // selects all payments
        let x = paymentsByTotal.filterAll(); // selects all payments*/

        //console.log("Date Chart | Datos: ", data);

        //$("#ExtraRow2").html("" + JSON.stringify(data));

        if (data && data.length > 0) {
            //console.log("DateChart | Start generation");

            var timeFmt = d3.timeParse("%Y-%m-%d %H:%M:%S");

            let csData = crossfilter(data);

            csData.dimTime = csData.dimension(function (d) {
                let date = d.creationDate;

                if ((/^\d/.test(date))) {
                    date = timeFmt(d.creationDate);
                }

                //console.log("Dates | ", d.creationDate, date);
                return date;
            });
            csData.dimDep = csData.dimension(function (d) { return d.Department; });
            csData.dimCity = csData.dimension(function (d) { return d.City; });

            csData.time = csData.dimTime.group(d3.timeHour);
            csData.cities = csData.dimCity.group();
            csData.departments = csData.dimDep.group();

            //console.log("DidUpdate | csData: ", csData.time.all(), csData.cities.top(5), csData.departments);

            let widthTimeChart = $("#pills-tabContent").width();
            widthTimeChart = widthTimeChart ? widthTimeChart : 600;
            //let widthDepaChart = $("#DepartmentsChart").width();
            //let widthCitiesChart = $("#CitiesChart").width();
            let widthDepaChart = (widthTimeChart / 2) - 20;
            let widthCitiesChart = (widthTimeChart / 2) - 20;

            //console.log("DidUpdate | Tamaños: ", widthTimeChart, widthDepaChart, widthCitiesChart);

            let tChart = this.GenerateTimeSeriesChart()
                .width(widthTimeChart)
                .x(function (d) { return d.key; })
                .y(function (d) { return d.value; });
            let cbChart = this.GenerateBarChart()
                .width(widthCitiesChart)
                //.width(800)
                .x(function (d) { return d.key; })
                .y(function (d) { return d.value; });

            let dbChart = this.GenerateBarChart()
                .width(widthDepaChart)
                //.width(800)
                .x(function (d) { return d.key; })
                .y(function (d) { return d.value; });

            tChart.onBrushed((selected) => {
                csData.dimTime.filter(selected);
                update();
            }).onEndBrush((selected) => {
                if (selected == null) {
                    csData.dimTime.filterAll();
                    update();
                }
            });

            cbChart.onMouseOver((d) => {
                csData.dimCity.filter(d.key);
                update();
            }).onMouseOut((d) => {
                csData.dimCity.filterAll();
                update();
            });

            dbChart.onMouseOver((d) => {
                csData.dimDep.filter(d.key);
                update();
            }).onMouseOut((d) => {
                csData.dimDep.filterAll();
                update();
            });

            function update() {
                d3.select("#DateChart")
                    .datum(csData.time.all())
                    //.datum(total.all())
                    .call(tChart)
                    .select(".x.axis")
                    .selectAll(".tick text")
                    .attr("transform", "rotate(-45) translate(-6, 1)");

                d3.select("#CitiesChart")
                    //.datum(csData.cities.all())                    
                    .datum(csData.cities.top(15))
                    .call(cbChart)
                    .select(".x.axis")
                    .selectAll(".tick text")
                    .attr("transform", "rotate(-45) translate(-6, 1)");

                d3.select("#DepartmentsChart")
                    .datum(csData.departments.top(15))
                    .call(dbChart)
                    .select(".x.axis")
                    .selectAll(".tick text")
                    .attr("transform", "rotate(-45) translate(-6, 1)");
            }

            update();
        }
    }

    GenerateTimeSeriesChart() {

        var margin = { top: 20, right: 20, bottom: 20, left: 20 },
            width = 760,
            height = 120,
            xValue = function (d) { return d[0]; },
            yValue = function (d) { return d[1]; },
            xScale = d3.scaleTime(),
            yScale = d3.scaleLinear(),
            area = d3.area().x(X).y1(Y),
            line = d3.line().x(X).y(Y),
            onBrushed = function () { },
            onEndBrush = function () { };

        function chart(selection) {
            selection.each(function (data) {

                // Convert data to standard representation greedily;
                // this is needed for nondeterministic accessors.
                data = data.map(function (d, i) {
                    //console.log("Time | Data: ", data, d, i);
                    return [xValue.call(data, d, i), yValue.call(data, d, i)];
                });
                //console.log("Extent |: ", d3.extent(data, function (d) { return d[0]; }));
                // Update the x-scale.
                xScale
                    .domain(d3.extent(data, function (d) {
                        //console.log("xScale | : ", d[0]);
                        return d[0];
                    }))
                    .range([0, width - margin.left - margin.right]);

                // Update the y-scale.
                yScale
                    .domain([0, d3.max(data, function (d) {
                        //console.log("yScale | : ", d[1]);
                        return d[1];
                    })])
                    .range([height - margin.top - margin.bottom, 0]);

                // Select the svg element, if it exists.
                var svg = d3.select(this).selectAll("svg").data([data]);

                // Otherwise, create the skeletal chart.
                var svgEnter = svg.enter().append("svg");
                var gEnter = svgEnter.append("g");
                gEnter.append("path").attr("class", "area");
                gEnter.append("path").attr("class", "line");
                gEnter.append("g").attr("class", "x axis");
                gEnter.append("g").attr("class", "brush");

                let colors = d3.scaleSequential(d3.interpolateYlOrRd)
                    .domain(d3.extent(data, function (d) { return d[1]; }));

                //console.log("TimeChart | Domain: ", colors, d3.extent(data, function (d) { return d[1]; }));
                // Update the outer dimensions.
                svg.merge(svgEnter).attr("width", width)
                    .attr("height", height);

                // Update the inner dimensions.
                var g = svg.merge(svgEnter).select("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                var lg = svg.append("defs").append("linearGradient")
                    .attr("id", "mygrad")//id of the gradient
                    .attr("x1", "0%")
                    .attr("x2", "0%")
                    .attr("y1", "0%")
                    .attr("y2", "100%"); //since its a vertical linear gradient 
                ;
                lg.append("stop")
                    .attr("offset", "0%")
                    .style("stop-color", "#810026")
                    .style("stop-opacity", 1);

                lg.append("stop")
                    .attr("offset", "50%")
                    .style("stop-color", "#fc9032")
                    .style("stop-opacity", 1);

                lg.append("stop")
                    .attr("offset", "100%")
                    .style("stop-color", "#ffffcb")
                    .style("stop-opacity", 1);

                // Update the area path.
                g.select(".area")
                    .attr("d", area.y0(yScale.range()[0]))
                    .style("fill", "url(#mygrad)");

                // Update the line path.
                g.select(".line")
                    .attr("d", line);

                // Update the x-axis.
                g.select(".x.axis")
                    .attr("transform", "translate(0," + yScale.range()[0] + ")")
                    .call(
                        d3.axisBottom(xScale)
                            .ticks(20)
                            .tickSize(6, 0)
                    );

                //console.log("xScale - yScale? : ", xScale.range()[1], yScale.range()[0]);
                g.select(".brush").call(d3.brushX()
                    .extent([
                        [0, 0],
                        [xScale.range()[1], yScale.range()[0]]
                    ])
                    .on("brush", brushed)
                    .on("end", endBrush)
                );
            });
        }

        function brushed() {
            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.
            let inSelect = d3.event.selection;
            var selection = d3.event.selection.map(xScale.invert);

            onBrushed(selection);
        }

        function endBrush() {
            if (!d3.event.sourceEvent) return; // Only transition after input.
            //if (!d3.event.selection) return; // Ignore empty selections.
            let inSelect = d3.event.selection;

            onEndBrush(inSelect);
        }

        // The x-accessor for the path generator; xScale ∘ xValue.
        function X(d) {
            //console.log("function X | d: ", d[0]);
            return xScale(d[0]);
        }

        // The y-accessor for the path generator; yScale ∘ yValue.
        function Y(d) {
            return yScale(d[1]);
        }

        chart.margin = function (_) {
            if (!arguments.length) return margin;
            margin = _;
            return chart;
        };

        chart.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
        };

        chart.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return chart;
        };

        chart.x = function (_) {
            if (!arguments.length) return xValue;
            xValue = _;
            return chart;
        };

        chart.y = function (_) {
            if (!arguments.length) return yValue;
            yValue = _;
            return chart;
        };

        chart.onBrushed = function (_) {
            if (!arguments.length) return onBrushed;
            onBrushed = _;
            return chart;
        };

        chart.onEndBrush = function (_) {
            if (!arguments.length) return onEndBrush;
            onEndBrush = _;
            return chart;
        };

        return chart;
    }

    GenerateBarChart() {

        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = 400,
            height = 400,
            innerWidth = width - margin.left - margin.right,
            innerHeight = height - margin.top - margin.bottom,
            xValue = function (d) { return d[0]; },
            yValue = function (d) { return d[1]; },
            xScale = d3.scaleBand().padding(0.1),
            //xScale = d3.scaleLinear(),
            //xScale = d3.scaleSequential(d3.interpolateYlOrRd),
            yScale = d3.scaleLinear(),
            onMouseOver = function () { },
            onMouseOut = function () { };

        function chart(selection) {
            selection.each(function (data) {

                // Select the svg element, if it exists.
                var svg = d3.select(this).selectAll("svg").data([data]);

                // Otherwise, create the skeletal chart.
                var svgEnter = svg.enter().append("svg");
                var gEnter = svgEnter.append("g");
                gEnter.append("g").attr("class", "x axis");
                gEnter.append("g").attr("class", "y axis");

                innerWidth = width - margin.left - margin.right,
                    innerHeight = height - margin.top - margin.bottom,

                    // Update the outer dimensions.
                    svg.merge(svgEnter).attr("width", width)
                        .attr("height", height);

                // Update the inner dimensions.
                var g = svg.merge(svgEnter).select("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



                let colors = d3.scaleQuantize()
                    .domain(data.map(xValue))
                    .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

                let colors2 = d3.scaleSequential(d3.interpolateYlOrRd)
                    .domain([d3.min(data.map(yValue)), d3.max(data.map(yValue))]);

                //console.log("Colors | Domain: ", d3.max(data.map(yValue)), d3.min(data.map(yValue)));

                xScale.rangeRound([0, innerWidth])
                    .domain(data.map(xValue));
                yScale.rangeRound([innerHeight, 0])
                    .domain([0, d3.max(data, yValue)]);

                g.select(".x.axis")
                    .attr("transform", "translate(0," + innerHeight + ")")
                    .call(d3.axisBottom(xScale));

                g.select(".y.axis")
                    .call(d3.axisLeft(yScale).ticks(10))
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Frequency");

                var bars = g.selectAll(".bar")
                    .data(function (d) { return d; });

                bars.enter().append("rect")
                    .attr("class", "bar")
                    .merge(bars)
                    .attr("x", X)
                    .attr("y", Y)
                    .attr("width", xScale.bandwidth())
                    .attr("height", function (d) { return innerHeight - Y(d); })
                    .attr("fill", function (d) {
                        //console.log("Segundo col | ", d);
                        return colors2(d.value);
                    })
                    .on("mouseover", onMouseOver)
                    .on("mouseout", onMouseOut);

                bars.exit().remove();
            });

        }

        // The x-accessor for the path generator; xScale ∘ xValue.
        function X(d) {
            return xScale(xValue(d));
        }

        // The y-accessor for the path generator; yScale ∘ yValue.
        function Y(d) {
            return yScale(yValue(d));
        }

        chart.margin = function (_) {
            if (!arguments.length) return margin;
            margin = _;
            return chart;
        };

        chart.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
        };

        chart.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return chart;
        };

        chart.x = function (_) {
            if (!arguments.length) return xValue;
            xValue = _;
            return chart;
        };

        chart.y = function (_) {
            if (!arguments.length) return yValue;
            yValue = _;
            return chart;
        };

        chart.onMouseOver = function (_) {
            if (!arguments.length) return onMouseOver;
            onMouseOver = _;
            return chart;
        };

        chart.onMouseOut = function (_) {
            if (!arguments.length) return onMouseOut;
            onMouseOut = _;
            return chart;
        };


        return chart;
    }

    render() {

        return (
            <div id="Chart" className=" fullSize">
                < div className="" >
                    <div className="row">
                        <div className="col-xs-12 col-md-12 fullSize">
                            <h2>Filtro por fecha</h2>
                            <p>Para filtrar la información sobre la siguiente gráfica, pasar el cursor por encima de la misma y seleccionar un rango de fechas de interés arrastrando el cursor.</p>
                            <div id="DateChart"></div>
                        </div>
                    </div>

                    <div className="row spaceRow">
                    </div>

                    <div className="row ">
                        <p>Para interactuar y filtrar información con las siguientes gráficas, únicamente ubicar el cursor en el area de interes</p>
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-md-6 fullSize">
                            <h2>Top 15 Departamentos</h2>
                            <div id="DepartmentsChart"></div>
                        </div>

                        <div className="col-xs-12 col-md-6 fullSize">
                            <h2>Top 15 Ciudades</h2>
                            <div id="CitiesChart"></div>
                        </div>
                    </div>

                    <div id="ExtraRow2" className="row spaceRow">
                    </div>
                </div >
            </div >
        );
    }
}

DateChart.propTypes = {
    Reports: PropTypes.array.isRequired
}

export default DateChart;