import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import LoginImages from "./LoginImages";
import Logo from "./Logo";

const API_URL = process.env.REACT_APP_API_URL;

function ResetPassword(props) {
  let history = useHistory();
  const token = props.match.params.token;
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!token) {
    window.location.href = "/";
    return;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      toast.error("New Password and Confirm Password not matched.");
      return;
    }

    setDisabled(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: token, password: password })
      });
      const json = await res.json();
      setDisabled(false);
      if (json.status === "success") {
        toast.success(
          "Password has been reset successfully, you can login now."
        );
        setPassword("");
        setCPassword("");
        history.push("/login");
      } else if (json.status === "error") {
        toast.error(json.error);
      } else {
        toast.error("Something went wrong, please try again later");
      }
    } catch (error) {
      setDisabled(false);
      toast.error("Something went wrong, please try again later");
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "cpassword") {
      setCPassword(e.target.value);
    }
  };

  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <LoginImages />
      <div
        className="contents order-2 order-md-1 position-relative d-flex justify-content-center align-items-center"
        style={{ width: "35%", height: "100vh" }}
      >
        <Logo />
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-8">
              <div className="mb-3">
                <h3 className="fw-bold">Set New Password</h3>
                <p className="mb-3 text-muted">
                  Enter new password for your cloudlead account.
                </p>
              </div>
              <form method="post" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <div className="inputGroupWithShowHide">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                      className="form-control p-2 border-1 border-primary"
                      value={password}
                      onChange={handleChange}
                      id="password"
                      autoComplete="new-password"
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
                  <label htmlFor="cpassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="inputGroupWithShowHide">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="cpassword"
                      className="form-control p-2 border-1 border-primary"
                      value={cpassword}
                      onChange={handleChange}
                      id="cpassword"
                      autoComplete="confirm-password"
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
                <input
                  type="submit"
                  value="Set New Password"
                  disabled={disabled}
                  className="btn py-3 btn-block w-100 btn-success"
                />
                <span className="d-block text-center my-4 text-muted">
                  — or —
                </span>
                <Link
                  to="/login"
                  className="btn py-3 btn-block w-100 btn-primary"
                >
                  Login
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
