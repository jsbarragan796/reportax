import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { assert } from 'chai';
import { resetDatabase } from "meteor/xolvio:cleaner";
import { sinon } from "meteor/practicalmeteor:sinon";
import { Factory } from "meteor/dburles:factory";

import faker from "faker";

import { TweetReports } from "../TweetReports.js";

if (Meteor.isServer) {
    describe("Twitter", () => {

        describe('GetTweets', () => {
            it('should get Tweets with #Reportax', () => {
                Meteor.call("Twitter.GetTweets", (err, res) => {
                    if (err) {

                    } else {
                        assert.isNotNull(res, "Tweets recieved!")
                    }
                });
            });
        });

        describe('addTweetReport', () => {
            let currentUser;

            let id = faker.random.number();
            let CreationDate = faker.date.recent();
            let City = faker.internet.userName();
            let Placa = faker.internet.userName();
            let Empresa = faker.internet.userName();
            let Denuncia = faker.internet.userName();
            let Images = [];
            let idDepartamento = faker.random.number();
            let userName = faker.internet.userName();
            let screenName = faker.internet.userName();

            beforeEach(() => {
                resetDatabase();
                Factory.define("user", Meteor.users, {
                    username: currentUser
                });

                currentUser = Factory.create("user");
                sinon.stub(Meteor, "user");
                Meteor.user.returns(currentUser);
            });

            afterEach(() => {
                Meteor.user.restore();
                resetDatabase();
            });

            it('should add a tweet report', () => {
                Meteor.call("Twitter.addTweetReport", id, CreationDate, City, Placa, Empresa, Denuncia, Images, idDepartamento, userName, screenName, (err, res) => {
                    let eAdd = Reports.findOne({ DepartmentId: DepId });
                    assert.isNotNull(eAdd, "Report added!");
                });
            });
        });
    });
}