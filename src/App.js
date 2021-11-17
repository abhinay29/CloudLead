import './assets/style.css'
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Routes } from "./routes";

import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Navbar from './components/Navbar';
import Cockpit from './components/Cockpit';
import PeopleSearch from './components/Radar/People';
import CompanySearch from './components/Radar/Company';
import PeopleWatchlist from './components/People/Watchlist'
import CompanyWatchlist from './components/Company/Watchlist'
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Verify from './components/Auth/Verify';
import Profile from './components/User/Profile';
import Billing from './components/User/Billing';
import Settings from './components/User/Settings';
import ChangePassword from './components/User/ChangePassword';
import Export from './components/People/Export';
import Feedback from './components/User/Feedback';
import Sidebar from './components/Sidebar';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

const RouteWithoutNavbar = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (<> <Component {...props} /> </>)} />
  );
};

const RouteWithNavbar = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      <>
        <Navbar />
        <Sidebar />
        <div style={{ "paddingLeft": "80px" }}>
          <Component {...props} />
        </div>
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
          <RouteWithNavbar exact path={Routes.CompanyWatchlist.path} component={CompanyWatchlist} />
          <RouteWithNavbar exact path={Routes.UserProfile.path} component={Profile} />
          <RouteWithNavbar exact path={Routes.Billing.path} component={Billing} />
          <RouteWithNavbar exact path={Routes.Settings.path} component={Settings} />
          <RouteWithNavbar exact path={Routes.ChangePassword.path} component={ChangePassword} />
          <RouteWithNavbar exact path={Routes.Feedback.path} component={Feedback} />
          <RouteWithoutNavbar exact path={Routes.Signup.path} component={Signup} />
          <RouteWithoutNavbar exact path={Routes.Signin.path} component={Login} />
          <RouteWithoutNavbar exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
          <RouteWithoutNavbar exact path={`${Routes.ResetPassword.path}/:token`} component={ResetPassword} />
          <RouteWithoutNavbar exact path={`${Routes.Verify.path}/:token`} component={Verify} />
          <RouteWithoutNavbar exact path={`${Routes.Export.path}/:token`} component={Export} />
        </Switch>
      </Router>
      <NotificationContainer />
    </>
  );
}

export default App

