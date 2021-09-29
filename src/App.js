import './assets/style.css';
import React from 'react'
// import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Routes } from "./routes";

import Navbar from './components/Navbar';
import Cockpit from './components/Cockpit';
import PeopleSearch from './components/Radar/People';
import CompanySearch from './components/Radar/Company';
import PeopleWatchlist from './components/People/Watchlist'
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';

const RouteWithoutNavbar = ({ component: Component, ...rest }) => {
  // const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoaded(true), 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <Route {...rest} render={props => (<> <Component {...props} /> </>)} />
  );
};

const RouteWithNavbar = ({ component: Component, ...rest }) => {
  // const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoaded(true), 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <Route {...rest} render={props => (
      <>
        {/* <Preloader show={loaded ? false : true} /> */}
        <Navbar />
        <Component {...props} />
      </>
    )}
    />
  );
};

function App() {

  return (
    <>
      <Router>
        <Switch>
          <RouteWithNavbar exact path={Routes.Cockpit.path} component={Cockpit} />
          <RouteWithNavbar exact path={Routes.PeopleSearch.path} component={PeopleSearch} />
          <RouteWithNavbar exact path={Routes.PeopleWatchlist.path} component={PeopleWatchlist} />
          <RouteWithNavbar exact path={Routes.CompanySearch.path} component={CompanySearch} />
          <RouteWithoutNavbar exact path={Routes.Signup.path} component={Signup} />
          <RouteWithoutNavbar exact path={Routes.Signin.path} component={Login} />
        </Switch>
      </Router>
    </>
  );
}

export default App

