import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";

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

  const onChange = (e) => {
    if (e.target.name === "phone") {
      e.target.value = e.target.value.replace(/\D/, "");
    }
    setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value });
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
      <div className="contents order-2 order-md-2" style={{ width: "35%" }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-10 px-4">
              <div className="mb-3">
                <h4 className="text-uppercase fw-bold">Cloudlead</h4>
                <h4 className="mb-4">Create Account</h4>
              </div>
              <form action="#" method="post" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="input-group">
                      <input
                        type="text"
                        value={signupInfo.fullname}
                        onChange={onChange}
                        id="fullname"
                        name="fullname"
                        required
                      />
                      <span class="bar"></span>
                      <label htmlFor="fullname">Your Full Name</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="input-group">
                      <input
                        type="email"
                        value={signupInfo.email}
                        onChange={onChange}
                        id="email"
                        name="email"
                        required
                      />
                      <span class="bar"></span>
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-12">
                    <div className="input-group">
                      <input
                        type="text"
                        value={signupInfo.company}
                        onChange={onChange}
                        name="company"
                        id="company"
                        required
                      />
                      <span class="bar"></span>
                      <label htmlFor="company">Company Name</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="input-group">
                      <input
                        type="password"
                        value={signupInfo.password}
                        onChange={onChange}
                        name="password"
                        id="password"
                        required
                      />
                      <span class="bar"></span>
                      <label htmlFor="password">Password</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-5 col-lg-5">
                    <div className="input-group">
                      {/* <Select
                        defaultValue={signupInfo.country}
                        closeMenuOnSelect={true}
                        name="country"
                        onChange={countrySelectChange}
                        value={signupInfo.country}
                        options={countries}
                        className="small w-100"
                        placeholder="Country"
                        styles={{ background: "#000" }}
                      /> */}
                      <div class="select">
                        <select
                          name="country"
                          id="country"
                          className="small select-text"
                          onChange={onChange}
                          placeholder="Country"
                          value={signupInfo.country}
                          required
                        >
                          <option value="" selected></option>
                          {countries &&
                            countries.map((c) => {
                              return <option value={c.value}>{c.label}</option>;
                            })}
                        </select>
                        <span class="select-highlight"></span>
                        <span class="select-bar"></span>
                        <label class="select-label">Country</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7 col-lg-7">
                    <div className="input-group">
                      <input
                        type="text"
                        value={signupInfo.phone}
                        onInput={onChange}
                        name="phone"
                        id="phone"
                        pattern="[0-9]*"
                        required
                      />
                      <span class="bar"></span>
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
      <div className="order-1 order-md-1 signup-content">
        <ul>
          <li>
            Search Millions of Global Contacts and Companies on Cloudlead
            plateform using advanced filters
          </li>
          <li>Unlock unlimited business Emails</li>
          <li>Schedule Email lists to campaigns</li>
          <li>Direct dials - Get access to thousands of direct dials</li>
          <li>Connect business leads via Chrome extension</li>
          <li>Email Verifier</li>
          <li>Track &amp; Analyze campaigns</li>
          <li>Custom data - B2B &amp; B2C</li>
          <li>Automation tools</li>
        </ul>
      </div>
    </div>
  );
};

export default Signup;
