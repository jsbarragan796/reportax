import Meteor from "meteor/meteor";
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Bases
import Init from './Init.jsx'
import App from './App.jsx'

export const renderRoutes = () => (
  <Router>
    <div id="Routes">
      <Route exact={true} path="/" component={Init}/>
      
      <Route path="/App" component={App}/>
    </div>
  </Router>
);