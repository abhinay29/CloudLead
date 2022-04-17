import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoginImages from "./LoginImages";
import Logo from "./Logo";

const API_URL = process.env.REACT_APP_API_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/forgotpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    });
    const json = await res.json();
    setDisabled(false);
    if (json.status === "success") {
      toast.success("Reset password link has been sent to your email.");
      setEmail("");
    } else if (json.status === "error") {
      toast.error(json.error);
    } else {
      toast.error("Something went wrong, please try again later");
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
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
                <h3 className="fw-bold">Forgot Password?</h3>
                <p className="mb-3 text-muted">
                  Enter your registered email and we will send you instruction
                  link to reset your account password.
                </p>
              </div>
              <form action="#" method="post" onSubmit={handleSubmit}>
                <div className="mb-3 first">
                  <label htmlFor="username" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control p-2 border-1 border-primary"
                    value={email}
                    onChange={handleChange}
                    id="email"
                    name="email"
                    autoComplete="username"
                  />
                </div>
                <input
                  type="submit"
                  value="Reset Password"
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

export default ForgotPassword;
