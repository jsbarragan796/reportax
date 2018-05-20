/* global $ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from "meteor/react-meteor-data";

import "../Css/MediaCarousel.css";

class ReportForm extends Component {
    constructor(props) {
        super(props);

        this.state = this.getMeteorData();

        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.addImg = this.addImg.bind(this);
        this.CreateReport = this.CreateReport.bind(this);
        this.ImgLoad = this.ImgLoad.bind(this);
    }

    componentWillMount() {
        //console.log("ReportForm| WillMount");

        $('.carousel').carousel({
            interval: false
        });
    }

    componentWillUpdate() {
        //console.log("ReportForm| WillUpdate");

        $('.carousel').carousel({
            interval: false
        });
    }

    componentDidMount() {

        let DepartamentosData = this.state.Departamentos;
        let SelectedDepartment = this.state.SelectedDepartment;

        $('.carousel').carousel({
            interval: false
        });

        if (!DepartamentosData) {
            Meteor.call("Assets.GetDepartmentsAndCities", (err, data) => {
                let depData = JSON.parse(data);

                /*depData.forEach((e, i) => {
                    e.Ciudades = [];
            
                    e.ciudades.forEach((f, j) => {
                        let city = {};
                        //console.log("Report Form | For? | ", e, f, i, j);
                        city.id = i + "-" + j;
                        city.Name = f;
            
                        e.Ciudades.push(city);
                    });
                });
            
                console.log("Report Form | For? | ", depData);*/

                this.setState({
                    Departamentos: depData
                });
            });
        }

        let comp = this.state.Companies;
        if (!comp) {

            Meteor.call("Assets.GetCompanies", (err, data) => {
                let companiesData = JSON.parse(data);

                this.setState({
                    Companies: companiesData
                });
            });
        }

        //$("#input-b3").fileinput();

        /*$("#input-b3").fileinput({
            deleteUrl: "/site/file-delete",
            overwriteInitial: false,
            maxFileSize: 5,
            initialCaption: "The Moon and the Earth"
        });*/

        //$("#input-b3").fileinput({ 'showUpload': false, 'previewFileType': 'any' });
    }

    componentDidUpdate() {
        let data = this.state.Departamentos;
        let SelectedDepartment = this.state.SelectedDepartment;
    }

    getMeteorData() {
        return {
            isAuthenticated: Meteor.userId() !== null,
            Departamentos: null,
            Companies: null,
            SelectedCompany: "0",
            SelectedDepartment: "0",
            SelectedCity: "0",
            CompañiaEscrita: "",
            ImgCount: 0,
            Images: [],
            PlacaInput: "",
            DenunciaInput: "",
            ConductorInput: "",
            CompanyInput: ""
        };
    }

    handleChange(event) {
        let target = event.target;

        this.setState({ [target.name]: target.value });
    }

    handleSelectChange(event) {
        let target = event.target;
        let option = $("#" + target.id).find("option:selected");
        let id = option[0].value;

        //console.log("ReportForm | handleSelectChange | ", target, option, id);

        this.setState({ [target.name]: id });
    }

    LoadDeparments() {
        let data = this.state.Departamentos;
        let res = <option>Loading...</option>;

        if (data) {
            res = data.map((d) => (
                <option key={d.id} value={d.id}>{d.departamento}</option>
            ));
        }
        return res;
    }

    LoadCities() {
        let data = this.state.Departamentos;
        let res = <option>Seleccione el departamento...</option>;
        let selectedDepartment = this.state.SelectedDepartment;
        let dep = null;

        if (data && selectedDepartment != "NONE") {

            data.forEach(e => {
                //console.log("FOR | ", e, selectedDepartment);
                if (e.id == selectedDepartment) {
                    dep = e;
                }
            });

            //console.log("ReportForm | LoadCities | ", data, selectedDepartment, dep);

            if (dep) {
                res = dep.ciudades.map((d, i) => (
                    <option key={"Ciudad" + i} value={d.id}>{d.Nombre}</option>
                ));
            }
        }
        return res;
    }

    LoadCompanies() {
        let data = this.state.Companies;
        let res = <option>Seleccione la empresa...</option>;
        let SelectedCity = this.state.SelectedCity;
        let city = null;

        if (data && SelectedCity != "NONE") {

            data.forEach(e => {
                //console.log("FOR | ", e, selectedDepartment);
                if (e.id == SelectedCity) {
                    city = e;
                }
            });

            //console.log("ReportForm | LoadCities | ", data, selectedDepartment, dep);

            if (city) {
                res = city.Taxis.map((d, i) => (
                    <option key={"Company" + i} value={d.id}>{d.Sigla}</option>
                ));

                /*this.setState({
                    SelectedCompany: city.id + "-0"
                });*/
            }
        }
        return res;
    }

    addImg(id, e) {
        //console.log("ReportForm | AddImg");
        let imgs = this.state.Images;

        imgs.push({
            imgCount: id,
            image: e
        });
    }

    ImgLoad(e) {
        let target = e.target;
        //console.log("ReportForm | ImgLoad | ", target);
        let me = this;

        if (target.files) {
            var filesAmount = target.files.length;
            var x = me.state.ImgCount;

            me.setState({
                ImgCount: filesAmount + x
            });

            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function (event) {
                    //$($.parseHTML('<img>')).attr('src', event.target.result).appendTo("#Gallery");
                    let count = x;
                    let active = "";

                    if (count == 0) {
                        active = " active";
                    }

                    $("#BigCarousel").append(
                        $($.parseHTML('<div>')).attr('class', "carousel-item" + active).append(
                            $($.parseHTML('<img>')).attr('src', event.target.result)
                        )
                    );

                    $("#SmallCarousel").append(
                        $($.parseHTML('<li>')).attr('class', active).attr('data-slide-to', count).attr("data-target", "#article-photo-carousel").append(
                            $($.parseHTML('<img>')).attr('src', event.target.result)
                        )
                    );

                    me.addImg(x, event.target.result);

                    //console.log("Report Form | ImgLoad | ", x, i, count, event);
                    x += 1;
                }

                reader.readAsDataURL(target.files[i]);
            }
        }
    }

    CompanyNotListed(e) {
        let target = e.target;
        let val = $("#CompanyCheck").prop("checked");

        //console.log("ReportForm | CompanyCheck: ", val, target);

        if (val) {
            $("#CompanyInput").prop('disabled', false);
            $("#CompanySelect").prop('disabled', true);
        } else {
            $("#CompanyInput").prop('disabled', true);
            $("#CompanySelect").prop('disabled', false);
        }
    }

    CreateReport() {
        let Companies = this.state.Companies;
        let Departamentos = this.state.Departamentos;
        let SelectedCity = this.state.SelectedCity;
        let SelectedCompany = this.state.SelectedCompany;
        let SelectedDepartment = this.state.SelectedDepartment;
        let ImgCount = this.state.ImgCount;
        let Images = this.state.Images;

        let ConductorInput = this.state.ConductorInput;
        let DenunciaInput = this.state.DenunciaInput;
        let PlacaInput = this.state.PlacaInput;

        let CompanyCheck = $("#CompanyCheck").prop("checked");
        let CompanyInput = this.state.CompanyInput;
        let FinalCompany = {};

        /*
        let DepOption = $("#DeparmentSelect").find("option:selected");
        let CityOption = $("#CitySelect").find("option:selected");

        SelectedDepartment = DepOption[0].value;
        SelectedCity = CityOption[0].value;*/

        //console.log("ReportForm | CreateReport: ", SelectedDepartment, SelectedCity, SelectedCompany, ImgCount, ConductorInput, DenunciaInput, PlacaInput, CompanyCheck, CompanyInput);
        // Capa departamento
        let Department = "";

        Departamentos.forEach(e => {
            //console.log("FOR | ", e, selectedDepartment);
            if (e.id == SelectedDepartment) {
                Department = e;
            }
        });
        // ----------

        // Capa Ciudad
        let City = "";

        Department.ciudades.forEach(e => {
            //console.log("ReportForm | City for: ", e, SelectedCity);
            if (e.id == SelectedCity) {
                City = e;
            }
        });
        // ----------

        if (CompanyCheck) {
            FinalCompany = CompanyInput;
        } else {
            //console.log("Report Company start | ", CompanyInput);
            let CompCity = null;

            Companies.forEach(e => {
                if (e.id == SelectedCity) {
                    CompCity = e;
                }
            });

            if (CompCity) {
                CompCity.Taxis.forEach(e => {
                    //console.log("Report company search | ", e.id, SelectedCompany);
                    if (e.id == SelectedCompany) {
                        FinalCompany = e;
                    }
                });
            }
        }

        this.props.CreateReport(CompanyCheck, SelectedDepartment, Department, SelectedCity, City, PlacaInput, DenunciaInput, Images, ConductorInput, SelectedCompany, FinalCompany);
    }

    render() {
        let Companies = this.state.Companies;
        let Departamentos = this.state.Departamentos;
        let SelectedCity = this.state.SelectedCity;
        let SelectedCompany = this.state.SelectedCompany;
        let SelectedDepartment = this.state.SelectedDepartment;
        let ImgCount = this.state.ImgCount;
        let Images = this.state.Images;

        //console.log("ReportForm | Data: ", Companies, Departamentos);
        //console.log("ReportForm | Info: ", "SelectedCity: " + SelectedCity, "SelectedCompany: " + SelectedCompany, "SelectedDepartment: " + SelectedDepartment, "ImgCount: " + ImgCount, Images);

        //console.log("ReportForm | Render | ", data);

        //{data ? JSON.stringify(data) : ""}

        return (
            <div id="ReportForm" className="container noMarginContainer">
                <div className="row align-items-center">
                    <div className="col-7">
                        <h2>Crear reporte</h2>
                    </div>

                    <div className="col-3">
                        <button className="btn btn-success" name="CREATE_REPORT" onClick={this.CreateReport}>Enviar reporte</button>
                    </div>

                    <div className="col-2">
                        <button className="btn btn-danger" name="CREATE_REPORT" onClick={this.props.BackHome}>Cancelar</button>
                    </div>
                </div>
                <hr className="my-2" />

                <form>
                    <div className="row">

                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="DeparmentSelect">Seleccione el departamento donde ocurrio el incidente</label>
                                <select className="form-control" id="DeparmentSelect" name="SelectedDepartment" onChange={this.handleSelectChange}>
                                    {this.LoadDeparments()}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="CitySelect">Seleccione la ciudad del incidente</label>
                                <select multiple className="form-control" id="CitySelect" name="SelectedCity" onChange={this.handleSelectChange}>
                                    {this.LoadCities()}
                                </select>
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="DeparmentSelect">Nombre del conductor (Opcional)</label>
                                <input type="text" className="form-control" id="ConductorInput" name="ConductorInput" onChange={this.handleChange} placeholder="Nombre del conductor..." />
                            </div>

                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="CompanyCheck" onChange={this.CompanyNotListed} />
                                <label className="form-check-label" htmlFor="CompanyCheck">La compañia no esta en la lista</label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="CompanyInput">Nombre de la empresa (Opcional)</label>
                                <input type="text" className="form-control" id="CompanyInput" name="CompanyInput" placeholder="Empresa..." onChange={this.handleChange} disabled />

                                <select className="form-control" id="CompanySelect" name="SelectedCompany" onChange={this.handleSelectChange}>
                                    {this.LoadCompanies()}
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="PlacaInput">Placa del vehiculo</label>
                        <input type="text" className="form-control" id="PlacaInput" name="PlacaInput" placeholder="ABC123" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="DenunciaInput">Escriba aqui su denuncia</label>
                        <textarea className="form-control" id="DenunciaInput" name="DenunciaInput" rows="3" onChange={this.handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleFormControlFile1">Example file input</label>
                        <input type="file" className="form-control-file" multiple id="exampleFormControlFile1" accept="image/png, image/jpeg, image/gif" onChange={this.ImgLoad} />
                    </div>
                </form>

                <div className="carousel slide article-slide" id="article-photo-carousel">
                    <div id="BigCarousel" className="carousel-inner cont-slider">
                    </div>

                    <ol id="SmallCarousel" className="carousel-indicators">
                    </ol>
                </div>

                {/*<input id="input-b3" name="input-b3[]" type="file" className="file" multiple
                    data-show-upload="false" data-show-caption="true" data-msg-placeholder="Select {files} for upload..." />*/}
            </div>
        );
    }
}

ReportForm.propTypes = {
    BackHome: PropTypes.func.isRequired,
    CreateReport: PropTypes.func.isRequired
}


export default withTracker(
    () => {


        return {
        }
    }
)(ReportForm);
