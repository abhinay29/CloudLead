import React, { useEffect, useState } from "react";
import Logo from "../Auth/Logo";
import { OverlayTrigger, Popover, Form } from "react-bootstrap";

function ChoosePlan() {
  const [annualBill, setAnnualBill] = useState(false);
  const [usd, setUsd] = useState(false);

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
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Monthly/Annually"
                    onChange={() => setAnnualBill(!annualBill)}
                  />
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
                    {annualBill ? "Billed Annually" : "Billed Monthly"}
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
                      <Popover id="custom-rates" className="shadow">
                        <Popover.Body>
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Upto contacts</th>
                                <th>INR price Per contact</th>
                                <th>Total price INR</th>
                              </tr>
                            </thead>
                            <tbody className="text-end fw-bold">
                              <tr>
                                <td>2000</td>
                                <td>2.50</td>
                                <td>5000</td>
                              </tr>
                              <tr>
                                <td>5000</td>
                                <td>2.00</td>
                                <td>10000</td>
                              </tr>
                              <tr>
                                <td>10000</td>
                                <td>1.50</td>
                                <td>15000</td>
                              </tr>
                              <tr>
                                <td>20000</td>
                                <td>1.00</td>
                                <td>20000</td>
                              </tr>
                              <tr>
                                <td>40000</td>
                                <td>0.80</td>
                                <td>32000</td>
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
                    // onClick={() => subscribe(1)}
                    className="btn btn-primary"
                  >
                    Choose Plan
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    // onClick={() => subscribe(2)}
                    className="btn btn-primary"
                  >
                    Choose Plan
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    // onClick={() => subscribe(3)}
                    className="btn btn-primary"
                  >
                    Choose Plan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ChoosePlan;
