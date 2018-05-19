import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { assert } from 'chai';
import { resetDatabase } from "meteor/xolvio:cleaner";
import { sinon } from "meteor/practicalmeteor:sinon";
import { Factory } from "meteor/dburles:factory";

import faker from "faker";

import { Assets } from "../Assets.js";

if (Meteor.isServer) {
    describe('Assets', () => {
        describe('GetColombiaMapData', () => {
            it('should get Colombian map data', () => {
                Meteor.call("Assets.GetColombiaMapData", (err, res) => {
                    if (err) {

                    } else {
                        assert.isNotNull(res, "Colombian map data resieved!")
                    }
                });
            });
        });
        
        describe('GetDepartmentsAndCities', () => {
            it('should get Departments and cities data', () => {
                Meteor.call("Assets.GetDepartmentsAndCities", (err, res) => {
                    if (err) {

                    } else {
                        assert.isNotNull(res, "Departments and cities resieved!")
                    }
                });
            });
        });
        
        describe('GetCompanies', () => {
            it('should get companies data', () => {
                Meteor.call("Assets.GetCompanies", (err, res) => {
                    if (err) {

                    } else {
                        assert.isNotNull(res, "Companies data resieved!")
                    }
                });
            });
        });
    });
}