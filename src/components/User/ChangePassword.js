import React, { useState } from "react";
import { toast } from "react-toastify";
import UserMenu from "./UserMenu";

const API_URL = process.env.REACT_APP_API_URL;

function ChangePassword() {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurPassword, setShowCurPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error("New password and Confirm password does not match.");
      return false;
    }
    if (!password.newPassword || !password.currentPassword) {
      toast.error("Please fill all fields.");
      return false;
    }
    let url = `${API_URL}/api/user/changepassword`;
    let update = await fetch(url, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(password)
    });
    let parsedData = await update.json();
    if (parsedData.status === "success") {
      toast.success("Password changed successfully.");
      setPassword({
        ...password,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } else if (parsedData.status === "error") {
      toast.error(parsedData.error);
    } else {
      toast.error("Something went wrong, please try again later.");
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
                <div className="cardTitle">
                  <h5>Change Password</h5>
                </div>
                <div className="mt-4 col-lg-6">
                  <form action="" id="changePassword" onSubmit={changePassword}>
                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">
                        Current Password
                      </label>
                      <div className="inputGroupWithShowHide">
                        <input
                          type={showCurPassword ? "text" : "password"}
                          value={password.currentPassword}
                          onChange={handleInputChange}
                          name="currentPassword"
                          id="currentPassword"
                          className="form-control p-2 border-1 border-primary"
                          autoComplete="current-password"
                          required
                        />
                        {!showCurPassword && (
                          <span
                            className="showBtn"
                            onClick={() => setShowCurPassword(true)}
                          >
                            <i className="fas fa-eye text-muted"></i>
                          </span>
                        )}
                        {showCurPassword && (
                          <span
                            className="hideBtn"
                            onClick={() => setShowCurPassword(false)}
                          >
                            <i className="fas fa-eye-slash text-muted"></i>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">
                        New Password
                      </label>
                      <div className="inputGroupWithShowHide">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={password.newPassword}
                          onChange={handleInputChange}
                          name="newPassword"
                          id="newPassword"
                          className="form-control p-2 border-1 border-primary"
                          autoComplete="new-password"
                          required
                        />
                        {!showNewPassword && (
                          <span
                            className="showBtn"
                            onClick={() => setShowNewPassword(true)}
                          >
                            <i className="fas fa-eye text-muted"></i>
                          </span>
                        )}
                        {showNewPassword && (
                          <span
                            className="hideBtn"
                            onClick={() => setShowNewPassword(false)}
                          >
                            <i className="fas fa-eye-slash text-muted"></i>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <div className="inputGroupWithShowHide">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={password.confirmPassword}
                          onChange={handleInputChange}
                          name="confirmPassword"
                          id="confirmPassword"
                          className="form-control p-2 border-1 border-primary"
                          autoComplete="new-password"
                          required
                        />
                        {!showConfirmPassword && (
                          <span
                            className="showBtn"
                            onClick={() => setShowConfirmPassword(true)}
                          >
                            <i className="fas fa-eye text-muted"></i>
                          </span>
                        )}
                        {showConfirmPassword && (
                          <span
                            className="hideBtn"
                            onClick={() => setShowConfirmPassword(false)}
                          >
                            <i className="fas fa-eye-slash text-muted"></i>
                          </span>
                        )}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
