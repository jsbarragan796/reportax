import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { assert } from 'chai';
import { resetDatabase } from "meteor/xolvio:cleaner";
import { sinon } from "meteor/practicalmeteor:sinon";
import { Factory } from "meteor/dburles:factory";
import { chai } from "meteor/practicalmeteor:chai";

import faker from "faker";

import { shallow } from "enzyme";

if (Meteor.isClient) {

    import App from "../Main/App.jsx";

    describe("App", () => {
        describe("App Full Render", () => {
            let currentUserName = faker.internet.userName();
            let currentUser;

            beforeEach(function () {
                resetDatabase();
                Factory.define("user", Meteor.users, {
                    username: currentUser
                });

                currentUser = Factory.create("user");
                sinon.stub(Meteor, "user");
                Meteor.user.returns(currentUser);

                return import('../Main/App.jsx').then((component) => {
                    MyComponent = component
                })
            });

            afterEach(() => {
                Meteor.user.restore();
                resetDatabase();
            });

            describe("NavBars rendering", () => {
                it("UserNavBar should render", () => {
                    const c = shallow(<App />);
                    chai.assert.isNotNull(c.find("UserNavBar"), "User nav bar loaded!");
                });
            });

            describe("Categories rendering", () => {
                it("Basic init should render", () => {
                    const c = shallow(<App />);
                    chai.assert.isNotNull(c.find("BasicInit"), "Basic Init page loaded!");
                });

                it("BasicStatistics page should render", () => {
                    const c = shallow(<App />);
                    chai.assert.isNotNull(c.find("BasicStatistics"), "BasicStatistics page loaded!");
                });
            });
        });
    });
}