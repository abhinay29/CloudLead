import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";

const API_URL = process.env.REACT_APP_API_URL;

const Signup = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cpassword: "",
    company: "",
    phone: ""
  });

  let history = useHistory();

  // let timeout;
  // let password = document.getElementById("password");
  // let strengthBadge = document.getElementById("StrengthDisp");
  // let strongPassword = new RegExp(
  //   "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  // );
  // let mediumPassword = new RegExp(
  //   "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  // );

  // const StrengthChecker = (PasswordParameter) => {
  //   if (strongPassword.test(PasswordParameter)) {
  //     strengthBadge.style.backgroundColor = "green";
  //     strengthBadge.textContent = "Strong";
  //   } else if (mediumPassword.test(PasswordParameter)) {
  //     strengthBadge.style.backgroundColor = "blue";
  //     strengthBadge.textContent = "Medium";
  //   } else {
  //     strengthBadge.style.backgroundColor = "red";
  //     strengthBadge.textContent = "Weak";
  //   }
  // };

  // password.addEventListener("input", () => {
  //   strengthBadge.style.display = "block";
  //   clearTimeout(timeout);

  //   timeout = setTimeout(() => {
  //     StrengthChecker(password.value);
  //   }, 500);

  //   if (password.value.length !== 0) {
  //     strengthBadge.style.display != "block";
  //   } else {
  //     strengthBadge.style.display = "none";
  //   }
  // });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    if (signupInfo.password !== signupInfo.cpassword) {
      toast.error("Passsword & Confirmed password does not matched");
      setDisabled(false);
      return false;
    }
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: signupInfo.first_name,
        last_name: signupInfo.last_name,
        email: signupInfo.email,
        password: signupInfo.password
      })
    });
    const json = await response.json();
    // console.log(json);
    if (json.status === "success") {
      toast.success(
        "Thank you for create account, please check your email and confirm it."
      );
      history.push("/login");
      return false;
    } else if (json.status === "error") {
      toast.error(json.error);
    } else {
      toast.error("Something went wrong please try again later.");
    }
    setDisabled(false);
  };

  const onChange = (e) => {
    setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value });
  };

  const responseGoogleSuccess = async (response) => {
    setDisabled(true);
    // const profileObj = response.profileObj;
    const res = await fetch(`${API_URL}/api/auth/googlelogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tokenId: response.tokenId })
    });
    const json = await res.json();
    console.log(json);
    if (json.success) {
      if (localStorage.getItem("searchQuery")) {
        localStorage.removeItem("searchQuery");
      }
      localStorage.setItem("token", json.authtoken);
      localStorage.setItem("uname", json.uname);
      localStorage.setItem("uemail", json.uemail);
      localStorage.removeItem("searchQuery");
      toast.success("Welcome uname!!!");
      history.push("/");
    } else {
      toast.error(json.error, { autoClose: 5000 });
      setDisabled(false);
    }
  };

  const responseGoogleFailure = (response) => {
    console.log(response);
  };

  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="contents order-2 order-md-2 w-50">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-6">
              <div className="mb-3">
                <h4 className="text-uppercase fw-bold">Cloudlead</h4>
                <h4 className="">Create Account</h4>
              </div>
              <form action="#" method="post" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control p-2 border-1 border-primary"
                    value={signupInfo.first_name}
                    onChange={onChange}
                    id="first_name"
                    name="first_name"
                    placeholder="First Name"
                  />
                </div>
                <div className="mb-3 first">
                  <input
                    type="text"
                    className="form-control p-2 border-1 border-primary"
                    value={signupInfo.last_name}
                    onChange={onChange}
                    id="last_name"
                    name="last_name"
                    placeholder="Last Name"
                  />
                </div>
                <div className="mb-3 first">
                  <input
                    type="email"
                    className="form-control p-2 border-1 border-primary"
                    value={signupInfo.email}
                    onChange={onChange}
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3 last mb-3">
                  <input
                    type="password"
                    className="form-control p-2 border-1 border-primary"
                    value={signupInfo.password}
                    onChange={onChange}
                    name="password"
                    id="password"
                    placeholder="Password"
                  />
                  <span id="StrengthDisp" class="badge displayBadge">
                    Weak
                  </span>
                </div>
                <div className="mb-3 last mb-3">
                  <input
                    type="password"
                    className="form-control p-2 border-1 border-primary"
                    value={signupInfo.cpassword}
                    onChange={onChange}
                    name="cpassword"
                    id="cpassword"
                    placeholder="Confirm Password"
                  />
                </div>
                <input
                  type="submit"
                  disabled={disabled}
                  value="Signup"
                  className="btn py-3 btn-block w-100 btn-primary"
                />
                <span className="d-block text-center my-4 text-muted">
                  — or —
                </span>
                <div className="social-login">
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
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none">
                  {" "}
                  Already have an account?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg order-1 order-md-1 w-50"
        style={{
          backgroundImage: "url(/assets/images/login.jpg)",
          backgroundPosition: "center",
          height: "100vh"
        }}
      ></div>
    </div>
  );
};

export default Signup;
