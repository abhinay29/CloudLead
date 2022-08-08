import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { userInfo } from "../../states/action-creator";

const API_URL = process.env.REACT_APP_API_URL;

function SettingsNotifications() {
  const userState = useSelector((state) => state.setUserData);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    generalEmails: "",
    adminEmails: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let Set = await fetch(`${API_URL}/api/user/notify-setting`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    let res = await Set.json();

    if (res.status === "success") {
      toast.success(res.message);
      initiateUserInfo();
    } else if (res.status === "error") {
      toast.error("Something went wrong, please try again later.");
    }
  };

  useEffect(() => {
    if (userState) {
      setFormData({
        generalEmails: userState.notificationSettings.generalEmails
          ? userState.notificationSettings.generalEmails.toString()
          : "",
        adminEmails: userState.notificationSettings.adminEmails
          ? userState.notificationSettings.adminEmails.toString()
          : ""
      });
    }
  }, [userState]);

  return (
    <div className="mt-3">
      <h5>Notification Settings</h5>
      <form action="" onSubmit={handleSubmit}>
        <div className="mb-3">
          <lable className="form-label" htmlFor="notifyEmails">
            Email addresses
          </lable>
          <textarea
            name="generalEmails"
            id="generalEmails"
            cols="30"
            rows="2"
            className="form-control"
            placeholder="Enter email addresses seperated by comma"
            onChange={handleChange}
            value={formData.generalEmails}
            defaultValue={
              userState.notificationSettings.generalEmails
                ? userState.notificationSettings.generalEmails.toString()
                : ""
            }
          ></textarea>
          <p style={{ fontSize: ".75rem" }}>
            Notifications will be sent to these email addresses. Enter email
            addresses seperated by comma
          </p>
        </div>
        <div className="mb-3">
          <lable className="form-label" htmlFor="notifyEmails">
            Administrator Email addresses
          </lable>
          <textarea
            name="adminEmails"
            id="adminEmails"
            cols="30"
            rows="2"
            className="form-control"
            placeholder="Enter email addresses seperated by comma"
            onChange={handleChange}
            value={formData.adminEmails}
            defaultValue={
              userState.notificationSettings.adminEmails
                ? userState.notificationSettings.adminEmails.toString()
                : ""
            }
          ></textarea>
          <p style={{ fontSize: ".75rem" }}>
            Weekly Statistic of your account will be sent to these email
            addresses. Enter email addresses seperated by comma
          </p>
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}

export default SettingsNotifications;
