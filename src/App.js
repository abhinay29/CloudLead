import "./assets/style.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Routes } from "./routes";

import Navbar from "./components/Navbar";
import Cockpit from "./components/Cockpit";
import PeopleSearch from "./components/Radar/People";
import CompanySearch from "./components/Radar/Company";
import PeopleWatchlist from "./components/People/Watchlist";
import CompanyWatchlist from "./components/Company/Watchlist";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import Verify from "./components/Auth/Verify";
import Profile from "./components/User/Profile";
import Billing from "./components/User/Billing";
import Settings from "./components/User/Settings";
import ChangePassword from "./components/User/ChangePassword";
import Export from "./components/People/Export";
import Unsubscribe from "./components/User/Unsubscribe";
import Sidebar from "./components/Sidebar";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Sequences from "./components/User/Sequences";
import Templates from "./components/User/Templates";
import CreateTemplate from "./components/User/CreateTemplate";

const RouteWithoutNavbar = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Component {...props} />
        </>
      )}
    />
  );
};

const RouteWithNavbar = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Navbar />
          <Sidebar />
          <div style={{ paddingLeft: "80px" }}>
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
          <RouteWithNavbar
            exact
            path={Routes.Cockpit.path}
            component={Cockpit}
          />
          <RouteWithNavbar
            exact
            path={Routes.PeopleSearch.path}
            component={PeopleSearch}
          />
          <RouteWithNavbar
            exact
            path={Routes.PeopleWatchlist.path}
            component={PeopleWatchlist}
          />
          <RouteWithNavbar
            exact
            path={Routes.CompanySearch.path}
            component={CompanySearch}
          />
          <RouteWithNavbar
            exact
            path={Routes.CompanyWatchlist.path}
            component={CompanyWatchlist}
          />
          <RouteWithNavbar
            exact
            path={Routes.UserProfile.path}
            component={Profile}
          />
          <RouteWithNavbar
            exact
            path={Routes.Billing.path}
            component={Billing}
          />
          <RouteWithNavbar
            exact
            path={Routes.Settings.path}
            component={Settings}
          />
          <RouteWithNavbar
            exact
            path={Routes.ChangePassword.path}
            component={ChangePassword}
          />
          <RouteWithNavbar
            exact
            path={Routes.Unsubscribe.path}
            component={Unsubscribe}
          />
          <RouteWithNavbar
            exact
            path={Routes.Sequences.path}
            component={Sequences}
          />
          <RouteWithNavbar
            exact
            path={Routes.Templates.path}
            component={Templates}
          />
          <RouteWithNavbar
            exact
            path={Routes.CreateTemplate.path}
            component={CreateTemplate}
          />
          <RouteWithoutNavbar
            exact
            path={Routes.Signup.path}
            component={Signup}
          />
          <RouteWithoutNavbar
            exact
            path={Routes.Signin.path}
            component={Login}
          />
          <RouteWithoutNavbar
            exact
            path={Routes.ForgotPassword.path}
            component={ForgotPassword}
          />
          <RouteWithoutNavbar
            exact
            path={`${Routes.ResetPassword.path}/:token`}
            component={ResetPassword}
          />
          <RouteWithoutNavbar
            exact
            path={`${Routes.Verify.path}/:token`}
            component={Verify}
          />
          <RouteWithoutNavbar
            exact
            path={`${Routes.Export.path}/:token`}
            component={Export}
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;
