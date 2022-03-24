import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "react-google-login";

const API_URL = process.env.REACT_APP_API_URL;

const Login = (props) => {
  let history = useHistory();

  const responseGoogleSuccess = async (response) => {
    setDisabled(true);
    const res = await fetch(`${API_URL}/api/auth/googlelogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tokenId: response.tokenId })
    });
    const json = await res.json();
    if (json.success) {
      if (localStorage.getItem("searchQuery")) {
        localStorage.removeItem("searchQuery");
      }
      localStorage.setItem("token", json.authtoken);
      localStorage.setItem("uname", json.uname);
      localStorage.setItem("uemail", json.uemail);
      if (json.lastLogin) {
        localStorage.setItem("lastLogin", json.lastLogin);
      }
      localStorage.removeItem("searchQuery");
      toast.success(`Welcome back!!!`);
      history.push("/");
    } else {
      toast.error(json.error, { autoClose: 5000 });
      setDisabled(false);
    }
  };

  const responseGoogleFailure = (response) => {
    console.log(response);
  };

  const [disabled, setDisabled] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
      const json = await response.json();
      if (json.success) {
        // Save the auth token and redirect
        if (localStorage.getItem("searchQuery")) {
          localStorage.removeItem("searchQuery");
        }
        localStorage.setItem("token", json.authtoken);
        localStorage.setItem("uname", json.uname);
        localStorage.setItem("uemail", json.uemail);
        if (json.lastLogin) {
          localStorage.setItem("lastLogin", json.lastLogin);
        }
        localStorage.removeItem("searchQuery");
        toast.success("Welcome back!!!");
        history.push("/");
      } else {
        if (json.error) {
          toast.error(json.error, { autoClose: 5000 });
        }
        if (json.errors) {
          toast.error(json.errors[0].msg, { autoClose: 5000 });
        }
        setDisabled(false);
      }
    } catch (error) {
      toast.error(error);
      setDisabled(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="bg order-1 order-md-2 w-50"
        style={{
          backgroundImage: "url(/assets/images/login.jpg)",
          backgroundPosition: "center",
          height: "100vh"
        }}
      ></div>
      <div className="contents order-2 order-md-1 w-50">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-6">
              <div className="mb-3">
                <h4 className="text-uppercase fw-bold">Cloudlead</h4>
                <h3 className="fw-bold">Sign In</h3>
                <p className="mb-3 text-muted">
                  Lorem ipsum dolor sit amet elit. Sapiente sit aut eos
                  consectetur adipisicing.
                </p>
              </div>
              <form action="#" method="post" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={onChange}
                    id="email"
                    name="email"
                    autoComplete="username"
                    required
                  />
                  <span className="bar"></span>
                  <label htmlFor="username">Email</label>
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={onChange}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                  />
                  <span className="bar"></span>
                  <label htmlFor="password">Password</label>
                </div>
                <div className="mb-4 d-flex">
                  <span className="me-auto">
                    <Link to="/signup" className="text-decoration-none">
                      Need an Account?
                    </Link>
                  </span>
                  <span className="ms-auto">
                    <Link
                      to="/forgot-password"
                      className="forgot-pass text-decoration-none"
                    >
                      Forgot Password?
                    </Link>
                  </span>
                </div>
                <input
                  type="submit"
                  value="Log In"
                  disabled={disabled}
                  className="btn py-3 btn-block w-100 btn-primary"
                />
                <span className="d-block text-center my-4 text-muted">
                  — or —
                </span>
                <div className="social-login">
                  {/* <a href="/" className="btn btn-danger py-2 w-100 d-flex justify-content-center align-items-center" onClick={() => { alert('This would be work soon.'); }}>
										<i className="fab fa-google me-2"></i> Login with Google
									</a> */}
                  <GoogleLogin
                    clientId="551396029089-1sm0epbfkpki0192mnb3e44qb6i66n1t.apps.googleusercontent.com"
                    className="d-flex justify-content-center align-items-center mx-auto"
                    buttonText="Continue with Google"
                    theme="dark"
                    onSuccess={responseGoogleSuccess}
                    onFailure={responseGoogleFailure}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
