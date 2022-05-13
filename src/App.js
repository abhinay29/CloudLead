import "./assets/style.css";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cockpitData } from "./states/action-creator";
import axios from "axios";

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
import Lists from "./components/User/Lists";
import Templates from "./components/User/Templates";
import CreateTemplate from "./components/User/CreateTemplate";
import CreateTemplateDnD from "./components/User/CreateTemplateDnD";

const API_URL = process.env.REACT_APP_API_URL;

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
  const dispatch = useDispatch();

  const initiateActivity = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/api/user/activity`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          dispatch(cockpitData({ unlocks: response.data.unlocks }));
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   initiateActivity();
  // }, []);

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
          <RouteWithNavbar exact path={Routes.Lists.path} component={Lists} />
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
          <RouteWithNavbar
            exact
            path={Routes.CreateTemplateDnD.path}
            component={CreateTemplateDnD}
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
