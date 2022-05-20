import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";
import Logo from "./Logo";

const API_URL = process.env.REACT_APP_API_URL;

const Signup = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    fullname: "",
    last_name: "",
    email: "",
    password: "",
    cpassword: "",
    company: "",
    phone: "",
    country: ""
  });
  const [countries, setCountries] = useState([]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    // if (signupInfo.password !== signupInfo.cpassword) {
    //   toast.error("Passsword & Confirmed password does not matched");
    //   setDisabled(false);
    //   return false;
    // }

    if (!signupInfo.country) {
      toast.error("Please select your country");
      setDisabled(false);
      return false;
    }

    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: signupInfo.fullname,
        last_name: signupInfo.last_name,
        email: signupInfo.email,
        password: signupInfo.password,
        phone: signupInfo.phone,
        country_code: signupInfo.country.value,
        company: signupInfo.company
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
      if (json.errors) {
        toast.error(json.errors[0].msg);
      } else {
        toast.error(json.error);
      }
    } else {
      toast.error("Something went wrong please try again later.");
    }
    setDisabled(false);
  };

  let strongPassword = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");

  const onChange = (e) => {
    if (e.target.name === "phone") {
      e.target.value = e.target.value.replace(/\D/, "");
    }
    setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      if (e.target.value === "") {
        setPasswordStrength(0);
      } else {
        if (!strongPassword.test(e.target.value)) {
          setPasswordStrength(1);
        } else {
          setPasswordStrength(0);
        }
      }
    }
  };
  // const countrySelectChange = (inputValue, actionMeta) => {
  //   setSignupInfo({ ...signupInfo, [actionMeta.name]: inputValue });
  // };

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
      toast.success(`Welcome ${json.uname}!!!`);
      history.push("/");
    } else {
      toast.error(json.error, { autoClose: 5000 });
      setDisabled(false);
    }
  };

  const responseGoogleFailure = (response) => {
    console.log(response);
  };

  const getCountries = async () => {
    let url = `${API_URL}/api/countries`;
    const response = await fetch(url);
    const countryRes = await response.json();
    setCountries(countryRes);
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="contents order-2 order-md-2 position-relative d-flex justify-content-center"
        style={{
          width: "35%",
          height: "100vh",
          paddingTop: "60px",
          paddingBottom: "20px"
        }}
      >
        <Logo />
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-10 px-4">
              <h3 className="fw-bold mb-4">Signup</h3>
              <form
                action="#"
                method="post"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="input-group-custom">
                      <input
                        type="text"
                        value={signupInfo.fullname}
                        onChange={onChange}
                        id="fullname"
                        name="fullname"
                        autoComplete="full-name"
                        required
                      />
                      <span className="bar"></span>
                      <label htmlFor="fullname">Full Name</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="input-group-custom">
                      <input
                        type="email"
                        value={signupInfo.email}
                        onChange={onChange}
                        id="email"
                        name="email"
                        required
                        autoComplete="work-email"
                      />
                      <span className="bar"></span>
                      <label htmlFor="email">Business Email</label>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-12">
                    <div className="input-group-custom">
                      <input
                        type="text"
                        value={signupInfo.company}
                        onChange={onChange}
                        name="company"
                        id="company"
                        autoComplete="company"
                        required
                      />
                      <span className="bar"></span>
                      <label htmlFor="company">Company</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="input-group-custom inputGroupWithShowHide">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={signupInfo.password}
                        onChange={onChange}
                        name="password"
                        id="password"
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
                      <span className="bar"></span>
                      <label htmlFor="password">Password</label>
                      {passwordStrength === 1 && (
                        <p className="text-danger small">
                          Please enter password with atleast 1 capital letter
                          and 1 Number
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-5 col-lg-5">
                    <div className="input-group-custom">
                      <div className="select">
                        <select
                          name="country"
                          id="country"
                          className="small select-text"
                          onChange={onChange}
                          placeholder="Country"
                          value={signupInfo.country}
                          required
                        >
                          <option value=""></option>
                          {countries &&
                            countries.map((c) => {
                              return <option value={c.value}>{c.label}</option>;
                            })}
                        </select>
                        <span className="select-highlight"></span>
                        <span className="select-bar"></span>
                        <label className="select-label">Country</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7 col-lg-7">
                    <div className="input-group-custom">
                      <input
                        type="text"
                        value={signupInfo.phone}
                        onInput={onChange}
                        name="phone"
                        id="phone"
                        pattern="[0-9]*"
                        required
                      />
                      <span className="bar"></span>
                      <label htmlFor="phone">Mobile Number</label>
                    </div>
                  </div>
                </div>

                <div className="w-75 mt-3 mx-auto">
                  <input
                    type="submit"
                    disabled={disabled}
                    value="Signup"
                    className="btn py-3 btn-block w-100 btn-primary"
                  />
                </div>

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
        className="order-1 order-md-1 signup-content"
        style={{ backgroundImage: "url(/assets/images/slide4.jpg)" }}
      >
        <Logo dark={false} bold={false} />
        <h6 className="fw-bold text-warning">Key Features:</h6>
        <ul className="list-unstyled">
          <li>
            <i className="fas fa-check me-3"></i>
            Search Millions of Global Contacts and Companies using advanced
            search filters
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Unlock unlimited business
            Emails
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Schedule Email lists to
            campaigns
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Direct dials - Get access to
            thousands of direct dials
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Connect business leads via
            Chrome extension
          </li>
          <li>
            <i className="fas fa-check me-3"></i>Email Verifier
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Track &amp; Analyze campaigns
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Custom data - B2B &amp; B2C
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Automation tools
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Data update every 90 days for
            the contacts and companies
          </li>
          <li>
            <i className="fas fa-check me-3"></i> Go for “custom data” if wish
            to buy one time Business Emails/Direct dials.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Signup;
