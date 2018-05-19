import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";

import '../Css/ColombiaMap.css';

class ColombiaMap extends Component {
    constructor(props) {
        super(props);
        this.projection = null;

        this.GenerateMap = this.GenerateMap.bind(this);
    }

    getProjection() {
        return this.projection;
    }

    componentDidMount() {
        console.log("Mount MAP");
        this.GenerateMap();
    }

    /*componentWillUpdate() {
        console.log("Will Update MAP");
        var svg = d3.select(this.svg).selectAll("g").remove();
        var svg = d3.select(this.svg).selectAll("rect").remove();
        this.GenerateMap();
    }*/

    GenerateMap() {
        var width = this.props.width || 960,
            height = this.props.height || 500,
            centered;

        var nWdith = $("#pills-tabContent").width(),
            nHeight = innerHeight;

        nWdith /= 2;
        nWdith += 75;

        //console.log("Colombia Map | Size: ", nWdith, nHeight);

        width = nWdith;
        height = nWdith;


        // Define color scale
        var color = d3.scaleLinear()
            .domain([1, 20])
            .clamp(true)
            .range(['#fff', '#c81b00']);

        this.projection = d3.geoMercator()
            .scale(1500)
            // Center the Map in Colombia
            .center([-74, 4.5])
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(this.projection);

        // Set svg width & height
        var svg = d3.select(this.svg)
            .attr('width', width)
            .attr('height', height);

        // Add background
        svg.append('rect')
            .attr('class', 'background')
            .attr('width', width)
            .attr('height', height)
            .on('click', clicked);

        var g = svg.append('g');

        var effectLayer = g.append('g')
            .classed('effect-layer', true);

        var mapLayer = g.append('g')
            .classed('map-layer', true);

        var dummyText = g.append('text')
            .classed('dummy-text', true)
            .attr('x', 10)
            .attr('y', 30)
            .style('opacity', 0);

        var bigText = g.append('text')
            .classed('big-text', true)
            .attr('x', 20)
            .attr('y', 45);

        let me = this;
        // Load map data
        //console.log("ColombiaMap | Antes del JSON");

        Meteor.call("Assets.GetColombiaMapData", (err, data) => {
            let mapData = JSON.parse(data);

            //console.log("ColombiaMap | ", err, mapData);

            var features = mapData.features;

            // Update color scale domain based on data
            let colorData = me.props.data.TweetReports;
            let nestedData = d3.nest().key((d) => d.idDepartamento).entries(colorData);
            let max = 0;

            nestedData.forEach(e => {
                if (max < e.values.length) {
                    max = e.values.length
                }
            });

            //console.log("MAX |", max);

            color.domain([0, max]);

            // Draw each province as a path
            mapLayer.selectAll('path')
                .data(features)
                .enter().append('path')
                .attr('d', path)
                .attr('vector-effect', 'non-scaling-stroke')
                .style('fill', fillFn)
                .on('mouseover', mouseover)
                .on('mouseout', mouseout)
                .on('click', clicked);
        });

        /*d3.json('Colombia.geo.json', function (error, mapData) {
            var features = mapData.features;

            // Update color scale domain based on data
            color.domain([0, d3.max(d3.values(me.props.data || {}))]);

            // Draw each province as a path
            mapLayer.selectAll('path')
                .data(features)
                .enter().append('path')
                .attr('d', path)
                .attr('vector-effect', 'non-scaling-stroke')
                .style('fill', fillFn)
                .on('mouseover', mouseover)
                .on('mouseout', mouseout)
                .on('click', clicked);
        });*/

        // Get province name
        function nameFn(d) {
            return d && d.properties ? d.properties.NOMBRE_DPT : null;
        }


        // Get province color
        function fillFn(d) {
            /*let data = me.props.data;
            if (data) {
                return color(data[nameFn(d)]);
            } else {
                return color(0);
            }*/
            let depId = d.properties.id;
            let name = nameFn(d);
            let data = me.props.data.TweetReports;
            let nestedData = d3.nest().key((d) => d.idDepartamento).entries(data);
            let value = 0;

            nestedData.forEach(e => {
                //console.log("COMP | ", e, e.key, depId);
                if (e.key == depId) {
                    value = e.values.length;
                }
            });

            let x = me.props.data[name];
            //console.log("GetColor | Final values: ", value, color(value));

            return color(value);
        }

        // When clicked, zoom in
        function clicked(d) {
            var x, y, k;

            // Compute centroid of the selected path
            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
                //console.log("Map clicked | ", g, d);
                if (me.props.HandleMapSelection) {
                    me.props.HandleMapSelection(d);
                }
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
                if (me.props.HandleMapSelection) {
                    me.props.HandleMapSelection(null);
                }
            }

            // Highlight the clicked province
            mapLayer.selectAll('path')
                .style('fill', function (d) { return centered && d === centered ? '#D5708B' : fillFn(d); });

            // Zoom
            g.transition()
                .duration(750)
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
        }

        function mouseover(d) {
            // Highlight hovered province
            d3.select(this).style('fill', 'orange');

            // Draw effects
            textArt(nameFn(d));
        }

        function mouseout(d) {
            // Reset province color
            mapLayer.selectAll('path')
                .style('fill', function (d) { return centered && d === centered ? '#D5708B' : fillFn(d); });

            // Remove effect text
            effectLayer.selectAll('text').transition()
                .style('opacity', 0)
                .remove();

            // Clear province name
            bigText.text('');
        }

        // Gimmick
        // Just me playing around.
        // You won't need this for a regular map.

        var BASE_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

        var FONTS = [
            "Open Sans",
            "Josefin Slab",
            "Arvo",
            "Lato",
            "Vollkorn",
            "Abril Fatface",
            "Old StandardTT",
            "Droid+Sans",
            "Lobster",
            "Inconsolata",
            "Montserrat",
            "Playfair Display",
            "Karla",
            "Alegreya",
            "Libre Baskerville",
            "Merriweather",
            "Lora",
            "Archivo Narrow",
            "Neuton",
            "Signika",
            "Questrial",
            "Fjalla One",
            "Bitter",
            "Varela Round"
        ];

        function textArt(text) {
            // Use random font
            var fontIndex = Math.round(Math.random() * FONTS.length);
            var fontFamily = FONTS[fontIndex] + ', ' + BASE_FONT;

            bigText
                .style('font-family', fontFamily)
                .text(text);

            // Use dummy text to compute actual width of the text
            // getBBox() will return bounding box
            dummyText
                .style('font-family', fontFamily)
                .text(text);
            var bbox = dummyText.node().getBBox();

            var textWidth = bbox.width;
            var textHeight = bbox.height;
            var xGap = 3;
            var yGap = 1;

            // Generate the positions of the text in the background
            var xPtr = 0;
            var yPtr = 0;
            var positions = [];
            var rowCount = 0;
            while (yPtr < height) {
                while (xPtr < width) {
                    var point = {
                        text: text,
                        index: positions.length,
                        x: xPtr,
                        y: yPtr
                    };
                    var dx = point.x - width / 2 + textWidth / 2;
                    var dy = point.y - height / 2;
                    point.distance = dx * dx + dy * dy;

                    positions.push(point);
                    xPtr += textWidth + xGap;
                }
                rowCount++;
                xPtr = rowCount % 2 === 0 ? 0 : -textWidth / 2;
                xPtr += Math.random() * 10;
                yPtr += textHeight + yGap;
            }

            var selection = effectLayer.selectAll('text')
                .data(positions, function (d) { return d.text + '/' + d.index; });

            // Clear old ones
            selection.exit().transition()
                .style('opacity', 0)
                .remove();

            // Create text but set opacity to 0
            selection.enter().append('text')
                .text(function (d) { return d.text; })
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; })
                .style('font-family', fontFamily)
                .style('fill', '#777')
                .style('opacity', 0);

            selection
                .style('font-family', fontFamily)
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; });

            // Create transtion to increase opacity from 0 to 0.1-0.5
            // Add delay based on distance from the center of the <svg> and a bit more randomness.
            selection.transition()
                .delay(function (d) {
                    return d.distance * 0.01 + Math.random() * 1000;
                })
                .style('opacity', function (d) {
                    return 0.1 + Math.random() * 0.4;
                });
        }
    }

    render() {
        return (
            <div className="colombiaMap">
                <svg
                    ref={(svg) => { this.svg = svg; }}>
                </svg>
            </div>);
    }
}

ColombiaMap.propTypes = {
    HandleMapSelection: PropTypes.func,
    TweetReports: PropTypes.array.isRequired
}
export default ColombiaMap;