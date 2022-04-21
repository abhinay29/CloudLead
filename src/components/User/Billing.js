import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import easyinvoice from "easyinvoice";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ChoosePlan from "./ChoosePlan";

const API_URL = process.env.REACT_APP_API_URL;

function Billing() {
  const userState = useSelector((state) => state.setUserData);

  const [billingInfo, setBillingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    gst: false,
    gst_number: ""
  });

  const [transactions, setTransactions] = useState([]);
  const [plan, setPlan] = useState({});

  const fetchTransactions = async () => {
    let url = `${API_URL}/api/user/billinghistory`;
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(billingInfo)
    });
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      setTransactions(parsedData.data);
    }
  };

  const fetchPlanDetails = async () => {
    let Plan = await fetch(`${API_URL}/api/plans/${userState.plan_id}`);
    let res = await Plan.json();
    setPlan(res);
  };

  useEffect(() => {
    fetchTransactions();
    fetchPlanDetails();
    // eslint-disable-next-line
  }, [userState]);

  useEffect(() => {
    if (userState.billing_info) {
      setBillingInfo(userState.billing_info);
    }
  }, [userState.billing_info]);

  const handleInput = (e) => {
    if (e.target.type === "checkbox") {
      setBillingInfo({ ...billingInfo, [e.target.name]: e.target.checked });
    } else {
      setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = `${API_URL}/api/user/update/billing`;
    let update = await fetch(url, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(billingInfo)
    });
    let parsedData = await update.json();
    if (parsedData.status === "success") {
      toast.success("Information updated successfully.");
    } else {
      toast.error("Something went wrong, please try again later.");
    }
  };

  const downloadInvoice = async (orderId) => {
    let url = `${API_URL}/api/payment/invoice`;
    let update = await fetch(url, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderId: orderId,
        email: localStorage.getItem("uemail")
      })
    });
    let parsedData = await update.json();
    if (parsedData.status === "success") {
      easyinvoice.download(`${orderId}.pdf`, parsedData.pdf);
    } else {
      toast.error(parsedData.error);
    }
  };

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
      <div className="fullHeightWithNavBar py-4">
        <div className="container">
          <div className="row">
            <div className="col" style={{ maxWidth: "280px" }}>
              <UserMenu />
            </div>
            <div className="col" style={{ width: "100%" }}>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="cardTitle d-flex justify-content-between align-items-center mb-3">
                    <h5>Billing</h5>
                    <button
                      type="button"
                      onClick={() => openModal("upgradePlanModal")}
                      className="btn btn-sm btn-primary"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-home-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#billingInfo"
                        type="button"
                        role="tab"
                        aria-controls="billingInfo"
                        aria-selected="true"
                      >
                        Billing Information
                      </button>
                      <button
                        className="nav-link"
                        id="nav-profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#billingHistory"
                        type="button"
                        role="tab"
                        aria-controls="billingHistory"
                        aria-selected="false"
                      >
                        Billing History
                      </button>
                      <button
                        className="nav-link"
                        id="nav-profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#currentPlan"
                        type="button"
                        role="tab"
                        aria-controls="currentPlan"
                        aria-selected="false"
                      >
                        Current Plan
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content mt-3" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="billingInfo"
                      role="tabpanel"
                      aria-labelledby="nbillingInfo-tab"
                    >
                      <form action="" onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label htmlFor="" className="form-label">
                                Billing Address
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="address"
                                onChange={handleInput}
                                value={billingInfo.address}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label htmlFor="" className="form-label">
                                City
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="city"
                                onChange={handleInput}
                                value={billingInfo.city}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label htmlFor="" className="form-label">
                                State
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="state"
                                onChange={handleInput}
                                value={billingInfo.state}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label htmlFor="" className="form-label">
                                Country
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="country"
                                onChange={handleInput}
                                value={billingInfo.country}
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
                                value={billingInfo.pin}
                                required
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
                                  checked={billingInfo.gst}
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label htmlFor="" className="form-label">
                                GST Number
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="gst_number"
                                onChange={handleInput}
                                value={billingInfo.gst_number}
                                required={billingInfo.gst}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary px-5"
                          >
                            <i className="fas fa-save me-2"></i>Save
                          </button>
                        </div>
                      </form>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="billingHistory"
                      role="tabpanel"
                      aria-labelledby="billingHistory-tab"
                    >
                      <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                          <thead>
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Order ID</th>
                              <th scope="col">Amount</th>
                              <th scope="col">Status</th>
                              <th scope="col">Receipt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.length === 0 && (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="py-3 text-center fs-6"
                                >
                                  No history found
                                </td>
                              </tr>
                            )}
                            {transactions.length > 0 &&
                              transactions.map((trans) => {
                                let date = new Date(trans.date);
                                date = date.toLocaleDateString("en-UK");
                                return (
                                  <tr key={trans.orderId}>
                                    <td>{date}</td>
                                    <td>{trans.orderId}</td>
                                    <td className="text-end">
                                      ₹ {trans.amount}.00
                                    </td>
                                    <td>{trans.status}</td>
                                    <td>
                                      {trans.status === "Completed" && (
                                        <button
                                          className="btn btn-sm btn-primary"
                                          onClick={() => {
                                            downloadInvoice(trans.orderId);
                                          }}
                                        >
                                          Download Invoice
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="currentPlan"
                      role="tabpanel"
                      aria-labelledby="currentPlan-tab"
                    >
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <h6>Your plan ({plan.name})</h6>
                          <div>
                            <h3 className="fw-bold me-2">{plan.name}</h3>
                            <h6 className="small">
                              Start Date: {userState.created_at}
                            </h6>
                            <h6 className="small">
                              End Date: {userState.created_at}
                            </h6>
                          </div>
                          <div className="table-responsive mt-4">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="fw-bold h6 border-bottom py-3">
                                    Net Amount
                                  </td>
                                  <td className="fw-bold h6 text-end border-bottom py-3">
                                    {plan.price_inr
                                      ? `₹ ${plan.price_inr}`
                                      : "--"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold h6 py-3">
                                    Total Amount
                                  </td>
                                  <td className="fw-bold h6 text-end py-3">
                                    {plan.price_inr
                                      ? `₹ ${plan.price_inr}`
                                      : "--"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <div className="px-3">
                            <h6 className="fw-bold text-center cardTitle">
                              Plan Details
                            </h6>
                            <div className="table-responsive">
                              <table className="table planTable">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Direct Dials
                                      </span>
                                    </td>
                                    <td
                                      style={{ width: "150px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        {plan.direct_dial === 25
                                          ? `${plan.direct_dial} Free Sample`
                                          : "--"}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Email Credits
                                      </span>
                                      <OverlayTrigger
                                        placement="right"
                                        overlay={
                                          <Tooltip>
                                            Number of contacts you can download
                                            per month
                                          </Tooltip>
                                        }
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </OverlayTrigger>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        {plan.download === 0
                                          ? "Custom Buy"
                                          : plan.download}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Contacts Unlock
                                      </span>
                                      <OverlayTrigger
                                        placement="right"
                                        overlay={
                                          <Tooltip>
                                            Number of contacts you can unlock
                                          </Tooltip>
                                        }
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </OverlayTrigger>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        {plan.contact_unlock === -1
                                          ? "Unlimited"
                                          : plan.contact_unlock}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Multi Selection limit
                                      </span>
                                      <OverlayTrigger
                                        placement="right"
                                        overlay={
                                          <Tooltip>
                                            Number of contacts you can select
                                            together
                                          </Tooltip>
                                        }
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </OverlayTrigger>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        {plan.multi_select}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Daily Email sending limit
                                      </span>
                                      <OverlayTrigger
                                        placement="right"
                                        overlay={
                                          <Tooltip>
                                            via your SMTP Server, GSuite,
                                            Microsoft 365
                                          </Tooltip>
                                        }
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </OverlayTrigger>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        {plan.daily_email_limit === 0
                                          ? "Not Available"
                                          : `${plan.daily_email_limit} / Day`}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Online Email Verification
                                      </span>
                                      <OverlayTrigger
                                        placement="right"
                                        overlay={
                                          <Tooltip>Single Selection</Tooltip>
                                        }
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </OverlayTrigger>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        Free
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        CSV upload
                                      </span>
                                      <OverlayTrigger
                                        placement="right"
                                        overlay={
                                          <Tooltip>
                                            Upload your own data for campaigns
                                          </Tooltip>
                                        }
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </OverlayTrigger>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        {plan.csv_upload === 1
                                          ? "Available"
                                          : "Not Available"}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Custom Data Request
                                      </span>
                                      <OverlayTrigger
                                        placement="right"
                                        overlay={
                                          <Tooltip>
                                            Get only Email credits/Mobile
                                            numbers without Subscription
                                          </Tooltip>
                                        }
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </OverlayTrigger>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        Yes
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Email Pattern Finder
                                      </span>
                                      <OverlayTrigger
                                        placement="right"
                                        overlay={<Tooltip>Online</Tooltip>}
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </OverlayTrigger>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        Free
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="fw-bold p-0">
                                        Linkedin Chrome Extension
                                      </span>
                                    </td>
                                    <td
                                      style={{ width: "100px" }}
                                      className="text-center"
                                    >
                                      <span className="me-2 text-primary">
                                        Available
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="upgradePlanModal" tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("upgradePlanModal")}
                aria-label="Close"
                style={{ zIndex: "1" }}
              ></button>
            </div>
            <div className="modal-body">
              <ChoosePlan />
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop"
        id="modal-backdrop"
        style={{ display: "none", opacity: ".5" }}
      ></div>
    </>
  );
}

export default Billing;
