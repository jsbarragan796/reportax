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
 
    import Init from '../Main/Init.jsx';

    describe("Initial page", () => {
        describe("Initial page Full Render", () => {

            it("Home page should render", () => {
                const c = shallow(<Init />);

                chai.assert.isNotNull(c.find("Init"), "Main page loaded!");
            });
        });
    });
}