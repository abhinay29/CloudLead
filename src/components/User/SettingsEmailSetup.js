import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

function SettingsEmailSetup() {
  const userState = useSelector((state) => state.setUserData);
  const [formData, setFormData] = useState({
    smtp_host: "",
    smtp_user: "",
    smtp_pass: "",
    smtp_port: 25,
    smtp_sender: ""
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveEmailSetup = async (e) => {
    e.preventDefault();

    let url = `${API_URL}/api/user/update/smtp`;
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      toast.success(parsedData.message);
    } else {
      toast.error(parsedData.error);
    }
  };

  useEffect(() => {
    if (userState.smtpSettings) {
      setFormData(userState.smtpSettings);
    }
  }, [userState.smtpSettings]);

  return (
    <div className="mt-3">
      <h5>Email Setup</h5>
      <form action="" onSubmit={saveEmailSetup}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                SMTP Hostname
              </label>
              <input
                type="text"
                className="form-control"
                name="smtp_host"
                onChange={handleInput}
                value={formData.smtp_host}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                SMTP Usename
              </label>
              <input
                type="text"
                className="form-control"
                name="smtp_user"
                onChange={handleInput}
                value={formData.smtp_user}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                SMTP Password
              </label>
              <input
                type="password"
                className="form-control"
                name="smtp_pass"
                onChange={handleInput}
                value={formData.smtp_pass}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                SMTP Post <span className="small">(Default: 25)</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="smtp_port"
                onChange={handleInput}
                value={formData.smtp_port}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                SMTP Sender Name
              </label>
              <input
                type="text"
                className="form-control"
                name="smtp_sender"
                onChange={handleInput}
                value={formData.smtp_sender}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="" className="form-label">
              SSL
            </label>
            <div className="mb-3">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="ssl"
                  id="ssl_yes"
                  value="yes"
                />
                <label className="form-check-label" for="ssl_yes">
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="ssl"
                  id="ssl_no"
                  value="no"
                />
                <label className="form-check-label" for="ssl_no">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mm">
          <button type="submit" className="btn btn-primary px-5">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsEmailSetup;
