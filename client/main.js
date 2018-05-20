/* global $ */
import React from "react";
import {Meteor} from "meteor/meteor";
import {render} from "react-dom";

import {renderRoutes} from "../imports/Ui/Main/Routes.jsx";

Meteor.startup(() => {
  $("html").attr("lang", "es");
  render(renderRoutes(), 
  document.getElementById("render-target"));
});
