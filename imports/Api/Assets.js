import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

if (Meteor.isServer) {

    Meteor.methods({
        "Assets.GetColombiaMapData"() {
            return Assets.getText("Colombia.geo.json");
        },
        "Assets.GetDepartmentsAndCities"(){            
            return Assets.getText("Departamentosv2.json");
        },
        "Assets.GetCompanies"(){            
            return Assets.getText("Empresasv2.json");
        }
    });
}