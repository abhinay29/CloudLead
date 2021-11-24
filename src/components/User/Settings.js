import React from 'react'
import SettingsEmailSetup from './SettingsEmailSetup'
import SettingsNotifications from './SettingsNotifications'
// import React, { useState, useEffect } from 'react'
import UserMenu from './UserMenu'
// import socketIOClient from "socket.io-client";
// import io from "socket.io-client";
// const socket = io.connect('http://localhost:5000/');

// const ENDPOINT = "http://localhost:5000";

function Settings() {

  // const [response, setResponse] = useState("");

  // useEffect(() => {
  //   // const socket = socketIOClient(ENDPOINT);
  //   socket.on("FromAPI", data => {
  //     setResponse(data);
  //   });
  // }, []);

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
                <div className="cardTitle mb-4">
                  <h5>Settings</h5>
                </div>
                <div>
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#notifications" type="button" role="tab" aria-controls="notifications" aria-selected="true">Notifications</button>
                      <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#emailSetup" type="button" role="tab" aria-controls="emailSetup" aria-selected="false">Email Setup</button>
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="notifications" role="tabpanel" aria-labelledby="notifications-tab">
                      <SettingsNotifications />
                    </div>
                    <div className="tab-pane fade" id="emailSetup" role="tabpanel" aria-labelledby="emailSetup-tab">
                      <SettingsEmailSetup />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
