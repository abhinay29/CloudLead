import React, { useState, useEffect } from 'react'
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
