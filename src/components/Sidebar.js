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
    <div className="col p-0" style={{ "maxWidth": "260px" }}>
      <div className="sideNavbar">
        <div className="card">
          <div className="card-body">
            <ul className="sibedarMenuUser">
              <li>
                <Link className={`${location.pathname === '/' ? "active" : ""}`} aria-current="page" to="/" onClick={() => linkClick()}><i className="far fa-chart-bar me-2"></i> Cockpit</Link>
              </li>
              <li>
                <Link className={`${location.pathname === '/radar/people' ? "active" : ""}`} to="/radar/people" onClick={() => linkClick()}><i className="fas fa-user-friends me-2"></i> People</Link>
              </li>
              <li>
                <Link className={`${location.pathname === '/radar/company' ? "active" : ""}`} to="/radar/company"><i className="far fa-building me-2"></i> Companies</Link>
              </li>
              <li>
                <Link to="lists"><i className="far fa-list-alt me-2"></i> Sequences</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
