import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Companies = new Mongo.Collection("Companies");

if (Meteor.isServer) {

    Meteor.publish('Companies', function CompaniesPublication() {
        let user = Meteor.user();
        if (user) {
            if (user.profile.isAdmin) {
                return Companies.find({}).fetch();
            } else {
                return Companies.find({}).fetch();
            }
        }
    });

    Meteor.methods({
        "Companies.GetAll"() {
            return Assets.getText("Companies.json")
                .then((res) => {
                    res.json();
                });
        }
    });
}