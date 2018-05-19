import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Reports = new Mongo.Collection("Reports");

if (Meteor.isServer) {

    Meteor.publish('Reports', function ReportsPublication() {
        let user = Meteor.user();
        //console.log("Reports | Publish: ", user);
        if (user) {
            if (user.profile.isAdmin) {
                return Reports.find({});
            } else {
                return Reports.find({});
            }
        }
    });

    Meteor.methods({
        "Reports.addReport"(CompanyCheck, DepId, Department, CityId, City, PlacaInput, DenunciaInput, Images, ConductorInput, CompId, FinalCompany) {
            check(CompanyCheck, Boolean);
            check(DepId, String);
            check(Department, Object);
            check(CityId, String);
            //check(City, Object);
            check(PlacaInput, String);
            check(DenunciaInput, String);
            check(Images, Array);
            check(ConductorInput, String);

            if (CompanyCheck) {
                check(FinalCompany, String);
            } else {
                check(CompId, String);
                check(FinalCompany, Object);
            }

            let creationDate = new Date();
            let userId = Meteor.user()._id;
            let userName = Meteor.user().username;
            /*
            console.log("Reports | addReport | User Data: ", userId, creationDate);
            console.log("Reports | addReport | Arrays: ", DepId, Department, CityId, City);
            console.log("Reports | addReport | Placa-Denuncia: ", PlacaInput, DenunciaInput);
            console.log("Reports | addReport | Imagenes: ", Images);
            console.log("Reports | addReport | Conductor: ", ConductorInput);
            console.log("Reports | addReport | Company", CompId, FinalCompany);*/

            let CompanyName = FinalCompany.Nombre ? FinalCompany.Nombre : FinalCompany;
            
            Reports.insert({
                userId,
                userName,
                creationDate,
                DepartmentId: DepId,
                Department: Department.departamento,
                CityId,
                City: "" + City.Nombre,
                Placa: PlacaInput,
                Denuncia: DenunciaInput,
                Images,
                Conductor: ConductorInput,
                CompanyId: CompId,
                Company: CompanyName
            });
        }
    });
}