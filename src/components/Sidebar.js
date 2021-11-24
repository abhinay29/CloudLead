import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { progressLoading } from '../states/action-creator';

function Sidebar() {

  const dispatch = useDispatch()

  let location = useLocation();

  const linkClick = () => {
    dispatch(progressLoading(30))
    setTimeout(() => {
      dispatch(progressLoading(100))
    }, 400);
  }

  return (
    <div className="sideNavbar">
      <ul>
        <li className={`${location.pathname === '/' ? "active" : ""}`}>
          <Link to="/" onClick={() => linkClick()}>
            <span className="icon"><i className="far fa-chart-bar"></i></span>
            <span className="title">Cockpit</span>
          </Link>
        </li>
        <li className={`${location.pathname === '/radar/people' ? "active" : ""}`}>
          <Link to="/radar/people" onClick={() => linkClick()}>
            <span className="icon"><i className="fas fa-user-friends"></i></span>
            <span className="title">People</span>
          </Link>
        </li>
        <li className={`${location.pathname === '/radar/company' ? "active" : ""}`}>
          <Link to="/radar/company">
            <span className="icon"><i className="far fa-building"></i></span>
            <span className="title">Companies</span>
          </Link>
        </li>
        <li className={`${location.pathname === '/sequences' ? "active" : ""}`}>
          <Link to="/sequences">
            <span className="icon"><i className="far fa-list-alt"></i></span>
            <span className="title">Sequences</span>
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <span className="icon"><i className="fas fa-cogs"></i></span>
            <span className="title">Preference</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
