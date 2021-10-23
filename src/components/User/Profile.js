import React from 'react'
import { Link } from 'react-router-dom'

function Profile() {
  return (
    <div className="fullHeightWithNavBar py-4">
      <div className="container">
        <div className="row">
          <div className="col" style={{ "maxWidth": "280px" }}>
            <div className="card">
              <div className="card-body">
                <ul className="sibedarMenuUser">
                  <li>
                    <Link to="/profile"> <i className="fas fa-user me-2"></i> My Profile </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col" style={{ "width": "100%" }}>
            <div className="card shadow-sm ">
              <div className="card-header bg-secondary">
                asdf asdf asdf
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Profile
