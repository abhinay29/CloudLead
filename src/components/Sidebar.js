import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { progressLoading } from "../states/action-creator";

const API_URL = process.env.REACT_APP_API_URL;

function Sidebar() {
  const dispatch = useDispatch();

  let location = useLocation();

  const linkClick = () => {
    dispatch(progressLoading(30));
    setTimeout(() => {
      dispatch(progressLoading(100));
    }, 400);
  };

  const [subscribed, setSubscribed] = useState("");

  const checkSubscription = async () => {
    let Subcription = await fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    let res = await Subcription.json();
    if (res.status) {
      setSubscribed("yes");
    } else {
      setSubscribed("no");
    }
  };

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/login");
      return false;
    }
    checkSubscription();
    // eslint-disable-next-line
  }, []);

  if (subscribed === "no") {
    return "";
  }

  return (
    <div className="sideNavbar">
      <ul>
        <li className={`${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/" onClick={() => linkClick()}>
            <span className="icon">
              <i className="fas fa-chart-bar"></i>
            </span>
            <span className="title">Cockpit</span>
          </Link>
        </li>
        <li
          className={`${location.pathname === "/radar/people" ? "active" : ""}`}
        >
          <Link to="/radar/people" onClick={() => linkClick()}>
            <span className="icon">
              <i className="fas fa-user-friends"></i>
            </span>
            <span className="title">People</span>
          </Link>
        </li>
        <li
          className={`${
            location.pathname === "/radar/company" ? "active" : ""
          }`}
        >
          <Link to="/radar/company">
            <span className="icon">
              <i className="fas fa-building"></i>
            </span>
            <span className="title">Companies</span>
          </Link>
        </li>
        <li className={`${location.pathname === "/sequences" ? "active" : ""}`}>
          <Link to="/sequences">
            <span className="icon">
              <i className="fas fa-list-alt"></i>
            </span>
            <span className="title">Sequences</span>
          </Link>
        </li>
        <li className={`${location.pathname === "/list" ? "active" : ""}`}>
          <Link to="/lists">
            <span className="icon">
              <i className="fas fa-th-list"></i>
            </span>
            <span className="title">Lists</span>
          </Link>
        </li>
        <li className={`${location.pathname === "/templates" ? "active" : ""}`}>
          <Link to="/templates">
            <span className="icon">
              <i className="fas fa-pencil-ruler"></i>
            </span>
            <span className="title">Templates</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
