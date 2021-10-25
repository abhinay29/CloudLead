import React from 'react'
import UserMenu from './UserMenu'

function Settings() {
  return (
    <div className="fullHeightWithNavBar py-4">
      <div className="container">
        <div className="row">
          <div className="col" style={{ "maxWidth": "280px" }}>
            <UserMenu />
          </div>
          <div className="col" style={{ "width": "100%" }}>
            <div className="card">
              <div className="card-body">
                <div className="cardTitle">
                  <h5>Settings</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Settings
