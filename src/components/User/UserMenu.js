import React from 'react'
import { Link, useLocation } from "react-router-dom";

function UserMenu() {

  let location = useLocation();

  return (
    <div className="sidebar">
      <div className="card">
        <div className="card-body">
          <ul className="sibedarMenuUser">
            <li><Link to="/profile" className={`${location.pathname === '/profile' ? "active" : ""}`}> <i className="fas fa-user me-2"></i> My Profile </Link></li>
            <li><Link to="/billing" className={`${location.pathname === '/billing' ? "active" : ""}`}><i className="fas fa-file-invoice me-2"></i> Billing</Link></li>
            <li><Link to="/settings" className={`${location.pathname === '/settings' ? "active" : ""}`}><i className="fas fa-cog me-2"></i> Settings</Link></li>
            <li><Link to="/change-password" className={`${location.pathname === '/change-password' ? "active" : ""}`}><i className="fas fa-lock me-2"></i> Change Password</Link></li>
            <li><Link to="/feedback" className={`${location.pathname === '/feedback' ? "active" : ""}`}><i className="fas fa-comment-alt me-2"></i> Feedback</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UserMenu
