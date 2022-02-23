import React, { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import { useSelector } from "react-redux";
import NotificationManager from "react-notifications/lib/NotificationManager";

const API_URL = process.env.REACT_APP_API_URL;

function Profile() {
  const userState = useSelector((state) => state.setUserData);

  const [profile, setProfile] = useState({
    country_code: "",
    phone: "",
    company: ""
  });

  useEffect(() => {
    if (userState) {
      setProfile({
        company: userState.company,
        phone: userState.phone,
        country_code: userState.country_code
      });
    }
  }, [userState]);

  const handleInput = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = `${API_URL}/api/user/update/profile`;
    let update = await fetch(url, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profile)
    });
    let parsedData = await update.json();
    if (parsedData.status === "success") {
      NotificationManager.success("Profile updated successfully.", "Success!");
    } else {
      NotificationManager.error(
        "Something went wrong, please try again later.",
        "Error!"
      );
    }
  };

  return (
    <div className="fullHeightWithNavBar py-4">
      <div className="container">
        <div className="row">
          <div className="col" style={{ maxWidth: "280px" }}>
            <UserMenu />
          </div>
          <div className="col" style={{ width: "100%" }}>
            <div className="card">
              <div className="card-body">
                <div className="cardTitle mb-4">
                  <h5>My Profile</h5>
                </div>
                <form action="" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={userState.first_name}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={userState.last_name}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Email
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={userState.email}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Company
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="company"
                          onChange={handleInput}
                          value={profile.company}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Country Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 91"
                          name="country_code"
                          onChange={handleInput}
                          value={profile.country_code}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-9">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Phone{" "}
                          <small className="text-secondary">
                            (You may receive an otp for payment verification on
                            this number)
                          </small>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          onChange={handleInput}
                          value={profile.phone}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary px-5">
                      <i className="fas fa-save me-2"></i>Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
