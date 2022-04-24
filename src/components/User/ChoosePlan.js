import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../Auth/Logo";
import { OverlayTrigger, Popover, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function ChoosePlan() {
  let history = useHistory();
  const userState = useSelector((state) => state.setUserData);
  const [annualBill, setAnnualBill] = useState(false);
  const [plans, setPlans] = useState([]);
  const [usd, setUsd] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const uemail = localStorage.getItem("uemail");
  const uname = localStorage.getItem("uname");
  const [profile, setProfile] = useState({
    country_code: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    gst: false,
    gst_number: ""
  });

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const subscribe = async (pid) => {
    let Plan = await fetch(`${API_URL}/api/plans/${pid}`);
    let res = await Plan.json();
    setSelectedPlan(res);
    if (pid === 1 || pid === 3) {
      return openModal("tosModal");
    }
    openModal("billingInformation");
    // openModal("orderSummery");
  };

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post(`${API_URL}/api/payment/orders`, {
      planId: selectedPlan.plan_id,
      annualBill: 1
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency, receipt } = result.data;

    const options = {
      key: "rzp_test_SqK219lnN6lSiA",
      amount: amount.toString(),
      currency: currency,
      name: "cloudlead.AI",
      description: "Transaction for " + selectedPlan.name,
      image: "/cl_logo_192x192.png",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          name: uname,
          email: uemail,
          contact: profile.phone,
          company: profile.company,
          country_code: profile.country_code,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          pin: profile.pin,
          gst: profile.gst,
          gst_number: profile.gst_number,
          planId: selectedPlan.plan_id,
          receipt: receipt,
          amount: parseInt(amount) / 100,
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature
        };

        const result = await axios.post(
          `${API_URL}/api/payment/success`,
          data,
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
              "Content-Type": "application/json"
            }
          }
        );

        if (result.data.status === "success") {
          toast.success(
            `${selectedPlan.name} has been successully subscribed, please login again to continue.`
          );
          closeModal("orderSummery");
          // window.location.reload();
          localStorage.removeItem("token");
          setTimeout(() => {
            history.push("/login");
          }, 3000);
        }
      },
      prefill: {
        name: uname,
        email: uemail,
        contact: profile.phone
      },
      theme: {
        color: "#7367f0"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // let User = await fetch(`${API_URL}/api/user/checkphone/${profile.phone}`, {
    //   method: "GET",
    //   headers: {
    //     "auth-token": localStorage.getItem("token"),
    //     "Content-Type": "application/json"
    //   }
    // });
    // let res = await User.json();

    // if (res.status === "error") {
    //   let phoneNumberInput = document.getElementById("phoneNumber");
    //   toast.error(res.error);
    //   setInvalidPhoneMsg("A user with this phone number is already exists.");
    //   phoneNumberInput.focus();
    //   phoneNumberInput.classList.add("is-invalid");
    //   return false;
    // }

    // document.getElementById("phoneNumber").classList.remove("is-invalid");
    closeModal("billingInformation");
    openModal("tosModal");
  };

  const handleInput = (e) => {
    if (e.target.type === "checkbox") {
      setProfile({ ...profile, [e.target.name]: e.target.checked });
    } else {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const acceptTerms = () => {
    var termsCheckbox = document.getElementById("terms");
    var policyCheckbox = document.getElementById("policy");
    if (!termsCheckbox.checked) {
      return toast.error("Please accept the Terms and Conditions");
    }
    if (!policyCheckbox.checked) {
      return toast.error("Please accept the Privacy Policy");
    }
    closeModal("tosModal");
    openModal("orderSummery");
  };

  const handleSubscribePlan = async () => {
    var termsCheckbox = document.getElementById("terms");
    var policyCheckbox = document.getElementById("policy");
    if (!termsCheckbox.checked) {
      return toast.error("Please accept the Terms and Conditions");
    }
    if (!policyCheckbox.checked) {
      return toast.error("Please accept the Privacy Policy");
    }

    let Subscribe = await fetch(`${API_URL}/api/user/subscribe`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: profile.phone,
        plan: selectedPlan.plan_id,
        company: profile.company
      })
    });
    let res = await Subscribe.json();
    if (res.status === "success") {
      toast.success(
        `${selectedPlan.name} has been successully subscribed, please login again to continue.`
      );
      localStorage.removeItem("token");
      setTimeout(() => {
        history.push("/login");
      }, 3000);
    } else {
      toast.error(res.error);
    }
  };

  const getPlans = async () => {
    let Plans = await fetch(`${API_URL}/api/plans`);
    let res = await Plans.json();
    setPlans(res);
  };
  useEffect(() => {
    getPlans();
    setProfile({
      ...profile,
      phone: userState.phone,
      country_code: userState.country_code,
      address: userState.billing_info.address,
      state: userState.billing_info.state,
      city: userState.billing_info.city,
      country: userState.billing_info.country,
      pin: userState.billing_info.pin,
      gst: userState.billing_info.gst,
      gst_number: userState.billing_info.gst_number
    });
    // eslint-disable-next-line
  }, []);

  const openModal = (modalId) => {
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    var modal = document.getElementById(modalId);
    modal.classList.add("show");
    modal.style.display = "block";
    let modalBackdrop = document.getElementById("modal-backdrop");
    modalBackdrop.style.display = "block";
  };

  const closeModal = (modalId) => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "visible";
    document.body.style.padding = "0";
    var modal = document.getElementById(modalId);
    modal.classList.remove("show");
    modal.style.display = "none";
    let modalBackdrop = document.getElementById("modal-backdrop");
    modalBackdrop.style.display = "none";
  };

  return (
    <>
      <div className="subscribe-container p-5">
        <Logo />
        <h4 className="text-center mb-2">Choose a Plan</h4>
        <div className="container">
          <table className="pricingTable">
            <thead>
              <tr>
                <th className="feature-name"></th>
                <th className="feature-name"></th>
                <th className="feature-name ps-5">
                  {/* <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Monthly/Annually"
                    onChange={() => setAnnualBill(!annualBill)}
                  /> */}
                  <Form.Check
                    type="switch"
                    id="disabled-custom-switch"
                    label="INR/USD"
                    onChange={() => setUsd(!usd)}
                  />
                </th>
                <th className="feature-name"></th>
              </tr>
              <tr>
                <th></th>
                <th>Free</th>
                <th>
                  <h6 className="fw-bold mb-3">
                    {usd ? "USD 72" : "INR 5500 + GST"} <br />
                    (per user, per month) <br />
                    {/* {annualBill ? "Billed Annually" : "Billed Monthly"} */}
                    Billed Annually
                  </h6>
                  Basic
                </th>
                <th>
                  Custom plan <br />
                  <h5 className="fw-bold">(Lets talk)</h5>
                  <OverlayTrigger
                    trigger="click"
                    key="bottom"
                    placement="bottom"
                    className="shadow"
                    overlay={
                      <Popover id="custom-rates-1" className="shadow">
                        <Popover.Body>
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Upto contacts</th>
                                <th>INR price Per contact</th>
                                <th>Total price INR</th>
                              </tr>
                            </thead>
                            <tbody className="text-end">
                              <tr>
                                <td>2000</td>
                                <td>2.50</td>
                                <td>5000</td>
                              </tr>
                              <tr>
                                <td>2001 - 5000</td>
                                <td>1.75</td>
                                <td>5250</td>
                              </tr>
                              <tr>
                                <td>5001 - 10000</td>
                                <td>1.00</td>
                                <td>5000</td>
                              </tr>
                              <tr>
                                <td>10001 - 20000</td>
                                <td>0.70</td>
                                <td>7000</td>
                              </tr>
                              <tr>
                                <td>20001 - 40000</td>
                                <td>0.50</td>
                                <td>10000</td>
                              </tr>
                            </tbody>
                          </table>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <button className="btn btn-link mt-3">Pricing</button>
                  </OverlayTrigger>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feature-name">
                  <h6>Direct Dials</h6>
                  <p></p>
                </td>
                <td>&mdash;</td>
                <td>&mdash;</td>
                <td>25 Free Samples</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>Email Credits</h6>
                  <p>(Number of contacts you can download per month)</p>
                </td>
                <td>50</td>
                <td>2000</td>
                <td>Custom Buy</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>Contacts Unlock</h6>
                  <p>(Number of contacts you can unlock)</p>
                </td>
                <td>50</td>
                <td>Unlimited</td>
                <td>Not Available</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>Multi Selection Limit</h6>
                  <p>(Number of contacts you can select together)</p>
                </td>
                <td>Not Available</td>
                <td>25</td>
                <td>50</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>Daily Email sending Limit</h6>
                  <p>(via your SMTP server, G-Suite, Microsoft365)</p>
                </td>
                <td>Not Available</td>
                <td>1000/Day</td>
                <td>Not Available</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>Online Email Verification</h6>
                  <p>(Single Selection)</p>
                </td>
                <td>Free</td>
                <td>Free</td>
                <td>Free</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>CSV Upload</h6>
                  <p>(Upload your own data for campaigns)</p>
                </td>
                <td>Not Available</td>
                <td>Available</td>
                <td>Not Available</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>Custom Data Request</h6>
                  <p>
                    (Get only Email credits/Mobile numbers without Subscription)
                  </p>
                </td>
                <td>Yes</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>Email Pattern Finder</h6>
                  <p>(Online)</p>
                </td>
                <td>Free</td>
                <td>Free</td>
                <td>Free</td>
              </tr>
              <tr>
                <td className="feature-name">
                  <h6>Linkedin Chrome Extension</h6>
                  <p></p>
                </td>
                <td>Available</td>
                <td>Available</td>
                <td>Available</td>
              </tr>
              <tr>
                <td className="feature-name"></td>
                <td>
                  <button
                    type="button"
                    onClick={() => subscribe(1)}
                    className="btn btn-primary"
                    disabled={userState.plan_id === 1 ? true : false}
                  >
                    Choose Plan
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => subscribe(2)}
                    className="btn btn-primary"
                    disabled={userState.plan_id === 2 ? true : false}
                  >
                    Choose Plan
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => subscribe(3)}
                    className="btn btn-primary"
                    disabled={userState.plan_id === 3 ? true : false}
                  >
                    Choose Plan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="modal fade"
        id="tosModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="tosLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="tosLabel">
                Acceptance
              </h4>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("tosModal")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="yes"
                  id="terms"
                />
                <label className="form-check-label" htmlFor="terms">
                  Accept the{" "}
                  <a
                    href="https://cloudlead.ai/terms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Terms & Conditions
                  </a>
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="yes"
                  id="policy"
                />
                <label className="form-check-label" htmlFor="policy">
                  Accept the{" "}
                  <a
                    href="https://cloudlead.ai/policy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => closeModal("tosModal")}
              >
                Close
              </button>
              {selectedPlan && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    selectedPlan.plan_id === 1 || selectedPlan.plan_id === 3
                      ? handleSubscribePlan
                      : acceptTerms
                  }
                >
                  Continue with {selectedPlan.name}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="billingInformation"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="tosLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="tosLabel">
                Billing Information
              </h4>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("billingInformation")}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleFormSubmit} className="needs-validation">
              <div
                className="modal-body"
                style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
              >
                <div className="row">
                  <div className="col-md-4 border-right border-end">
                    {selectedPlan && (
                      <div className="text-center">
                        <h3>{selectedPlan.name}</h3>
                        <hr />
                        Plan Details will show here
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="p-3">
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
                              Company Name{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="company"
                              id="company"
                              value={userState.company}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Country Code{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. 91"
                              name="country_code"
                              value={userState.country_code}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Phone <span className="text-danger">*</span>
                              <small className="text-secondary">
                                (You may receive an otp for payment verification
                                on this number)
                              </small>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              id="phoneNumber"
                              value={userState.phone}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Billing Address{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              name="address"
                              onChange={handleInput}
                              value={profile.address}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Country <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="country"
                              onChange={handleInput}
                              value={profile.country}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              State <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="state"
                              onChange={handleInput}
                              value={profile.state}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              City <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="city"
                              onChange={handleInput}
                              value={profile.city}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Pin Code
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="pin"
                              onChange={handleInput}
                              value={profile.pin}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <div className="form-check form-switch">
                              <label
                                className="form-check-label"
                                style={{ fontWeight: "600" }}
                                htmlFor="gstApplicable"
                              >
                                GST Applicable?(Optional)
                              </label>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="gstApplicable"
                                name="gst"
                                onChange={handleInput}
                                checked={profile.gst}
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              GST Number{" "}
                              {profile.gst && (
                                <span className="text-danger">*</span>
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="gst_number"
                              onChange={handleInput}
                              value={profile.gst_number}
                              required={profile.gst}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedPlan && (
                  <input
                    type="hidden"
                    name="plan_id"
                    value={selectedPlan.plan_id}
                  />
                )}
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => closeModal("billingInformation")}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Continue <i className="fas fa-chevron-right ms-2"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="orderSummery"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="tosLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="tosLabel">
                Order Summery
              </h4>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("orderSummery")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-end">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ width: "70%" }}>
                      <h6 className="mb-0 text-uppercase">
                        {selectedPlan.name} Plan
                      </h6>
                    </td>
                    <td className="text-end">
                      ₹ {selectedPlan.annual_price_inr}
                      {/* {annualBill
                        ? selectedPlan.annual_price_inr
                        : selectedPlan.price_inr} */}
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <td colSpan="2" style={{ width: "70%" }}>
                      <ul>
                        {/* <li>1 {annualBill ? "Year" : "Month"}</li> */}
                        <li>1 Year</li>
                        <li>{selectedPlan.unlock_daily} Daily Unlock</li>
                        <li>{selectedPlan.unlock_month} Monthly Unlock</li>
                        <li>{selectedPlan.download} Downloads</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <td>
                      <h6 className="mb-0 fw-bold">SUBTOTAL</h6>
                    </td>
                    <td className="text-end fw-bold">
                      ₹ {selectedPlan.annual_price_inr}
                      {/* {annualBill
                        ? selectedPlan.annual_price_inr
                        : selectedPlan.price_inr} */}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6 className="mb-0">CGST 9%</h6>
                    </td>
                    <td className="text-end">
                      ₹ {(selectedPlan.annual_price_inr * 9) / 100}
                      {/* {annualBill
                        ? (selectedPlan.annual_price_inr * 9) / 100
                        : (selectedPlan.price_inr * 9) / 100} */}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6 className="mb-0">SGST 9%</h6>
                    </td>
                    <td className="text-end">
                      ₹ {(selectedPlan.annual_price_inr * 9) / 100}
                      {/* {annualBill
                        ? (selectedPlan.annual_price_inr * 9) / 100
                        : (selectedPlan.price_inr * 9) / 100} */}
                    </td>
                  </tr>
                  <tr className="border-top">
                    <td>
                      <h6 className="mb-0 text-primary fw-bold">TOTAL</h6>
                    </td>
                    <td className="text-end text-primary fw-bold">
                      ₹{" "}
                      {parseInt(selectedPlan.annual_price_inr) +
                        ((selectedPlan.annual_price_inr * 9) / 100) * 2}
                      {/* {annualBill
                        ? parseInt(selectedPlan.annual_price_inr) +
                          ((selectedPlan.annual_price_inr * 9) / 100) * 2
                        : selectedPlan.price_inr +
                          ((selectedPlan.price_inr * 9) / 100) * 2} */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              {selectedPlan && (
                <input
                  type="hidden"
                  name="plan_id"
                  value={selectedPlan.plan_id}
                />
              )}
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => closeModal("orderSummery")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => displayRazorpay()}
              >
                Pay &amp; Subscribe{" "}
                <i className="fas fa-chevron-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        className="modal-backdrop"
        id="modal-backdrop"
        style={{ display: "none", opacity: ".5" }}
      ></div> */}
    </>
  );
}

export default ChoosePlan;
