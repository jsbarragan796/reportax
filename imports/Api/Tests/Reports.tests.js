import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { assert } from 'chai';
import { resetDatabase } from "meteor/xolvio:cleaner";
import { sinon } from "meteor/practicalmeteor:sinon";
import { Factory } from "meteor/dburles:factory";

import faker from "faker";

import { Reports } from "../Reports.js";

if (Meteor.isServer) {
    describe("Reports", () => {
        describe('addReport', () => {
            let currentUserName = faker.internet.userName();
            let currentUser;

            let FinalCompany = faker.company.companyName();
            let Department = faker.internet.userName();
            let City = faker.internet.userName();
            let PlacaInput = faker.internet.userName();
            let DenunciaInput = faker.internet.userName();
            let FinalCompany = faker.internet.userName();
            let ConductorInput = faker.internet.userName();
            let Images = [];

            let DepId = faker.random.number();
            let CityId = faker.random.number();
            let CompId = faker.random.number();

            let companyCheck = true;

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

            it('should add a report', () => {
                Meteor.call("Reports.addReport", companyCheck, DepId, Department, CityId, City, PlacaInput, DenunciaInput, Images, ConductorInput, CompId, FinalCompany, (err, res) => {
                    let eAdd = Reports.findOne({ DepartmentId: DepId });
                    assert.isNotNull(eAdd, "Report added!");
                });
            });
        });
    });
}