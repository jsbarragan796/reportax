import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Images = new Mongo.Collection("Images");

if (Meteor.isServer) {

    Meteor.publish('Images', function ImagesPublication() {
        let user = Meteor.user();
        if (user) {
            if (user.profile.isAdmin) {
                return Images.find({}).fetch();
            } else {
                return Images.find({}).fetch();
            }
        }
    });

    Meteor.methods({
        "Images.InsertNew"() {

        }
    });
}