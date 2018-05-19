import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColombiaMap from '../D3/ColombiaMap';
import moment from "moment/moment";
import "moment/locale/es";
import { TweetsReports } from '../../Api/TweetsReports';

class TwitterView extends Component {
    constructor(props) {
        super(props);

        this.state = this.getMeteorData();

        this.BuscarDepartamento = this.BuscarDepartamento.bind(this);
        this.HandleMapSelection = this.HandleMapSelection.bind(this);
        this.GenerateTweetReports = this.GenerateTweetReports.bind(this);
        this.LoadNewTweetReports = this.LoadNewTweetReports.bind(this);
    }

    getMeteorData() {
        let tweets = this.props.TweetReports;
        //console.log("TwitterView | getMeteorData ", tweets);

        return {
            Departamentos: [],
            tweets: [],
            filteredTweets: tweets,
            filtered: false
        };
    }

    componentDidMount() {
        //this.LoadNewTweetReports();
        moment.locale('es');

        Meteor.call("Assets.GetDepartmentsAndCities", (err, res) => {
            if (err) {
                throw err;
            } else {
                //console.log("Twitter view | Depts load: ", JSON.parse(res));
                this.setState({
                    Departamentos: JSON.parse(res)
                });
            }
        });
    }

    HandleMapSelection(select) {
        //console.log("HandleMapSelection | ", select);
        let res = [];
        let tweets = this.props.TweetReports;
        let depts = this.state.Departamentos;

        if (select != null) {
            let depId = select.properties.id;
            let dep = null;

            depts.map((d, i) => {
                if (d.id == depId) {
                    dep = d;
                }
            });

            //console.log("HandleMapSelection | Department: ", dep, tweets);

            tweets.map((d, i) => {
                let ct = dep.ciudades;

                ct.forEach((c, i) => {
                    //console.log("HandleMapSelection | Search: ", d.City, c.Nombre);
                    if (d.City == c.Nombre) {
                        res.push(d);
                    }
                });
            });

            //console.log("HandleMapSelection | Filtered: ", res);

            this.setState({
                filteredTweets: res,
                filtered: true
            });
        } else {
            this.setState({
                filteredTweets: tweets,
                filtered: true
            });
        }
    }

    BuscarDepartamento(City) {
        let deps = this.state.Departamentos;

        if (City != "_NO") {
            let res = {};

            deps.forEach((d, i) => {
                let ciudades = d.ciudades;

                ciudades.forEach((c) => {
                    //console.log("Buscando departamento", City, c.Nombre, City == c.Nombre ? true : false);
                    if (c.Nombre == City) {
                        //console.log("Buscando departamento", City);
                        res = d;
                    }
                });
            });

            return res;
        } else {
            return {};
        }
    }

    LoadNewTweetReports() {
        //console.log("Loading new Tweets");

        Meteor.call("Twitter.GetTweets", (err, res) => {
            if (err) {
                throw err;
            } else {
                //console.log("Twitter.GetTweets | ", err, res);

                res.statuses.forEach((tw, i) => {
                    if (i == 2) {
                        //$("#TwitterView").html(JSON.stringify(tw));
                    }

                    let hashtags = tw.entities.hashtags;
                    let media = tw.entities.media;
                    let Denuncia = tw.text;
                    let user = tw.user;
                    let userName = user.name;
                    let screen_name = user.screen_name;

                    let id = tw.id_str;
                    let CreationDate = tw.created_at;

                    let Images = [];

                    if (media) {
                        media.forEach((img, i) => {
                            if (img.type == "photo") {
                                Images.push(img.media_url_https);
                            }
                        });
                    }

                    let City = "_NO";
                    let Placa = "_NO"
                    let Empresa = "_NO"

                    hashtags.forEach((ht, i) => {
                        let htT = ht.text;
                        let size = htT.length;
                        /*if ( /^\d/.test(htT[3]) && /^\d/.test(htT[4]) && /^\d/.test(htT[5])) {
                            Placa = htT;
                        }else*/

                        if (htT.startsWith("Placa")) {
                            Placa = htT.substring(5, size);
                        } else if (htT.startsWith("Ciudad")) {
                            City = htT.substring(6, size);
                        } else if (htT.startsWith("Empresa")) {
                            Empresa = htT.substring(7, size);
                        }
                    }); 

                    let departamento = this.BuscarDepartamento(City);
                    let depId = departamento.id ? departamento.id : "_NO";
                    let depNombre = departamento.departamento ? departamento.departamento : "_NO";

                    //console.log("Nuevo TweetReporte", departamento, depId, depNombre);

                    //console.log("Nuevo TweetReporte", id, CreationDate, City, Placa, Empresa, Denuncia, Images, depId);

                    Meteor.call("Twitter.addTweetReport", id, CreationDate, City, Placa, Empresa, Denuncia, Images, depId, depNombre, userName, screen_name, (err, res) => {
                        if (err) {
                            //console.log("addTweetReport | ERRO: ", err);
                        } else {

                        }
                    });
                });
            }
        });
    }

    GenerateTweetReports() {
        let filtered = this.state.filtered;
        let res = <h3>¡No hay tweets en ese departamento!</h3>;
        let TweetReports = this.props.TweetReports;

        if (filtered) {
            TweetReports = this.state.filteredTweets;
        }

        //console.log("GenerateTweetReports | ", TweetReports);

        if (TweetReports && TweetReports.length > 0) {
            res = (
                <div className="list-group list-group-flush">
                    {TweetReports.map((d, i) => {
                        //console.log("GenerateTweetReports | Act Tweet: ", d);

                        let img = d.Images;
                        let date = moment(d.CreationDate).locale("es").fromNow();
                        let city = d.City;
                        let placa = d.Placa;

                        if (img.length > 0) {
                            return (
                                <div key={"Card" + i} className="card" style={{ width: "18rem" }}>
                                    <img className="card-img-top" src={img[0]} alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">{"" + date}</h5>
                                        {city != "_NO" ? <h5>{"Ciudad: " + city}</h5> : ""}
                                        {placa != "_NO" ? <h5>{"Placa: " + placa}</h5> : ""}
                                        <p className="card-text">{d.Denuncia}</p>
                                        <p>{d.userName}</p>
                                        <small>{"@" + d.screenName}</small>
                                    </div>
                                </div>);
                        } else {
                            return (
                                <div key={"Card" + i} className="card border-primary mb-3" style={{ maxWidth: "18rem" }}>
                                    <div className="card-header">{"" + date}</div>
                                    <div className="card-body text-primary">
                                        {/*<h5 className="card-title"></h5>*/}
                                        {city != "_NO" ? <h5>{"Ciudad: " + city}</h5> : ""}
                                        {placa != "_NO" ? <h5>{"Placa: " + placa}</h5> : ""}
                                        <p className="card-text">{d.Denuncia}</p>
                                        <p>{d.userName}</p>
                                        <small>{"@" + d.screenName}</small>
                                    </div>
                                </div>);
                        }
                    })}
                </div>
            );
        }
        return res;
    }

    render() {
        let res = <h1>Loading...</h1>
        let TweetReports = this.props.TweetReports;

        if (TweetReports) {
            res = (<div className="row">

                <div className="col-5 fullWidth scrollable">
                    {this.GenerateTweetReports()}
                </div>

                <div id="MapCol" className="col-7 fullWidth derScroll">
                    {this.props.isAdmin ? <button className="btn btn-primary btnReport" onClick={this.LoadNewTweetReports}>Cargar nuevos tweets</button> : ""}
                    <ColombiaMap
                        width="600"
                        height="600"
                        data={{ TweetReports }}
                        HandleMapSelection={this.HandleMapSelection}
                        TweetReports={TweetReports} />
                </div>
            </div>);
        }

        return (
            <div id="TwitterView">
                {res}
            </div>
        );
    }
}

TwitterView.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    TweetReports: PropTypes.array.isRequired
}

export default TwitterView;