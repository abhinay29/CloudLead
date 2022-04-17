import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { userInfo, cockpitData } from "../states/action-creator";

const API_URL = process.env.REACT_APP_API_URL;

const CockpitDash = () => {
  const userState = useSelector((state) => state.setUserData);
  const dashboard = useSelector((state) => state.CockpitData);
  const [showGuide, setShowGuide] = useState(true);
  const dispatch = useDispatch();

  const initiateUserInfo = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/api/auth/getuser`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          dispatch(userInfo(response.data.userdata));
          localStorage.removeItem("searchQuery");
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

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
          dispatch(cockpitData(response.data));
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const updateShowGuideStatus = async () => {
    await axios({
      method: "POST",
      url: `${API_URL}/api/user/guide-status`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      data: { status: 0 }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          initiateUserInfo();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const handleCloseQuickGuide = () => {
    let donotshowGuide = document.getElementById("donotshowGuide");
    if (donotshowGuide.checked) {
      updateShowGuideStatus();
    }
    setShowGuide(false);
  };

  useEffect(() => {
    setShowGuide(userState.showGuide);
    initiateActivity();
  }, []);

  return (
    <>
      <div
        style={{
          height: "calc(100vh - 56px)",
          overflowX: "hidden",
          overflowY: "auto"
        }}
      >
        <div className="container mt-4">
          <div className="mb-3">
            <button className="btn btn-sm btn-secondary me-2">Today</button>
            <button className="btn btn-sm btn-outline-secondary me-2">
              This Month
            </button>
            <button className="btn btn-sm btn-outline-secondary me-2">
              Last Month
            </button>
            <button className="btn btn-sm btn-outline-secondary me-2">
              This Quarter
            </button>
            <button className="btn btn-sm btn-outline-secondary me-2">
              This Year
            </button>
            <button className="btn btn-sm btn-outline-secondary me-2">
              Last Year
            </button>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Contact Unlocked</h5>
                    <h1 className="text-dark">
                      {/* {dashboard.unlocks ? dashboard.unlocks : 0} */}
                      {userState.dailyUnlock ? userState.dailyUnlock : 0}
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Contact Download</h5>
                    <h1 className="text-dark">
                      {userState.downloads ? userState.downloads : 0}
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Total Email Sent</h5>
                    <h1 className="text-dark">50</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Open Rate</h5>
                    <h1 className="text-dark">60%</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Link Click Rate</h5>
                    <h1 className="text-dark">45%</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Reply Rate</h5>
                    <h1 className="text-dark">35%</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Unsubscribe</h5>
                    <h1 className="text-dark">35%</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Forward</h5>
                    <h1 className="text-dark">10%</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <h5 className="text-dark-50 mb-5">Bounce</h5>
                    <h1 className="text-dark">35%</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showGuide} size="lg" aria-labelledby="quick-guide" centered>
        <Modal.Header>
          <Modal.Title id="quick-guide" className="text-primary">
            Quick Guide
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>How to use the platform?</h4>
          <ul>
            <li>Apply search filters for people/companies</li>
            <li>Unlock business Emails as per your preferred selection</li>
            <li>Open “My Watchlist” to see unlocked contacts</li>
            <li>Send email campaigns/Download contacts from MyWatchlist</li>
            <li>Use “Custom data” if wish to purchase one time Email list</li>
            <li>Contact sales team for "Direct Dials" or any support query.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="justify-content-between align-items-center">
          <Form>
            <Form.Group className="mb-3" controlId="donotshowGuide">
              <Form.Check type="checkbox" label="Do not show this again." />
            </Form.Group>
          </Form>
          {/* <input type="checkbox" /> */}
          <Button
            onClick={() => {
              handleCloseQuickGuide();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CockpitDash;
