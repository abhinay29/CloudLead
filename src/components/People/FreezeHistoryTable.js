import React, { useState } from "react";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

// class Cf {
//   construct(count, cost) {
//     this.count = count;
//     this.cost = cost;
//   }
function setCf(count, cost) {
  console.log("Class Count: ", count);
  localStorage.setItem(
    "carryForward",
    JSON.stringify({ count: count, cost: cost })
  );
}
function getCf() {
  return JSON.parse(localStorage.getItem("carryForward"));
}
// }

// const setCarryForward = (count, cost) => {
//   localStorage.setItem(
//     "carryForward",
//     JSON.stringify({ count: count, cost: cost })
//   );
// };
// const getCarryForward = () => {
//   return JSON.parse(localStorage.getItem("carryForward"));
// };

function FreezeHistoryTable(props) {
  const { freezeHistory, backToSearch, closeHistoryModal, getFreezeHistory } =
    props;

  const openModal = (modalId) => {
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    var modal = document.getElementById(modalId);
    modal.classList.add("show");
    modal.style.display = "block";
    let modalBackdrop = document.getElementById(
      "modal-backdrop-FreezeHistoryTable"
    );
    modalBackdrop.style.display = "block";
  };

  const closeModal = (modalId) => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "visible";
    document.body.style.padding = "0";
    var modal = document.getElementById(modalId);
    modal.classList.remove("show");
    modal.style.display = "none";
    let modalBackdrop = document.getElementById(
      "modal-backdrop-FreezeHistoryTable"
    );
    modalBackdrop.style.display = "none";
  };

  const priceCalulator = (ec) => {
    let remain = 0;
    let price = 0;
    let count = 0;
    let preVal = getCf();
    console.log("PreVal: ", preVal);
    let carryForwardCount = 0;
    // var tempCount = [];
    // tempCount.push(ec);
    // setCountValue(tempCount);
    // console.log(countValue);

    // count = ec - preVal.count;

    if (preVal.count > 0) {
      price = preVal.count * preVal.cost;
      count = ec - preVal.count;
    } else {
      count = ec;
    }

    // count = ec;

    // if (preVal.cost === 2.5) {
    //   if (count > 3000) {
    //     price = price + 3000 * 1.75;
    //     remain = remain - 3000;
    //     if (remain > 5000) {
    //       price = price + 5000 * 1;
    //       remain = remain - 5000;
    //       if (remain > 10000) {
    //         price = price + 10000 * 0.7;
    //         remain = remain - 10000;
    //         if (remain > 0) {
    //           price = price + remain * 0.5;
    //         }
    //       } else {
    //         price = price + remain * 0.7;
    //         carryForwardCount = 10000 - remain;
    //         setCarryForward(carryForwardCount, 0.7);
    //       }
    //     } else {
    //       price = price + remain * 1;
    //       carryForwardCount = 5000 - remain;
    //       setCarryForward(carryForwardCount, 1);
    //     }
    //   } else {
    //     price = price + preVal.count * 2.5;
    //     carryForwardCount = 3000 - preVal.count;
    //     setCarryForward(carryForwardCount, 1.75);
    //   }
    // } else if (preVal.cost === 1.75) {
    //   if (count > 5000) {
    //     price = price + 5000 * 1;
    //     remain = remain - 5000;
    //     if (remain > 10000) {
    //       price = price + 10000 * 0.7;
    //       remain = remain - 10000;
    //       if (remain > 0) {
    //         price = price + remain * 0.5;
    //       }
    //     } else {
    //       price = price + remain * 0.7;
    //       carryForwardCount = 10000 - remain;
    //       setCarryForward(carryForwardCount, 0.7);
    //     }
    //   } else {
    //     price = price + remain * 1;
    //     carryForwardCount = 5000 - remain;
    //     setCarryForward(carryForwardCount, 1);
    //   }
    // } else if (preVal.cost === 1) {
    //   if (remain > 10000) {
    //     price = price + 10000 * 0.7;
    //     remain = remain - 10000;
    //     if (remain > 0) {
    //       price = price + remain * 0.5;
    //     }
    //   } else {
    //     price = price + remain * 0.7;
    //     carryForwardCount = 10000 - remain;
    //     setCarryForward(carryForwardCount, 0.7);
    //   }
    // } else if (preVal.cost === 0.7) {
    //   if (remain > 0) {
    //     price = price + remain * 0.5;
    //   }
    // }

    if (count > 2000) {
      price = 2000 * 2.5;
      remain = count - 2000;
      if (remain > 3000) {
        price = price + 3000 * 1.75;
        remain = remain - 3000;
        if (remain > 5000) {
          price = price + 5000 * 1;
          remain = remain - 5000;
          if (remain > 10000) {
            price = price + 10000 * 0.7;
            remain = remain - 10000;
            if (remain > 0) {
              price = price + remain * 0.5;
            }
          } else {
            price = price + remain * 0.7;
            carryForwardCount = 10000 - remain;
            // setCarryForward();
            setCf(carryForwardCount, 0.7);
            console.log("Email Count: ", ec);
            console.log("Under 10001 - 20000: ", carryForwardCount);
          }
        } else {
          price = price + remain * 1;
          carryForwardCount = 5000 - remain;
          setCf(carryForwardCount, 1);
          console.log("Email Count: ", ec);
          console.log("Under 5001 - 10000: ", carryForwardCount);
        }
      } else {
        price = price + remain * 1.75;
        carryForwardCount = 3000 - remain;
        setCf(carryForwardCount, 1.75);
        console.log("Email Count: ", ec);
        console.log("Under 2001 - 5000: ", carryForwardCount);
      }
    } else {
      price = count * 2.5;
      carryForwardCount = 2000 - count;
      setCf(carryForwardCount, 2.5);
    }
    console.log("Final Price", price);
    return price;
  };

  const direactDialPrice = (c) => {
    return parseInt(c) * 8;
  };

  const handleDeleteFreezeData = async (searchId) => {
    if (
      !window.confirm("Do you really want to delete this search from list?")
    ) {
      return false;
    }

    let data = await fetch(`${API_URL}/api/user/delete-freezelist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ searchId: searchId })
    });

    if (!data) {
      return toast.error("Something went wrong, please try again later.");
    }
    const res = await data.json();
    if (res.status === "success") {
      // let rowElement = document.getElementById(searchId);
      // rowElement.remove();
      getFreezeHistory();
      toast.success("Search removed from freezed list successfully");
    } else {
      toast.error(
        res.error ? res.error : "Something went wrong, please try again later."
      );
    }
  };

  return (
    <>
      <table className="table freezeHistoryTable">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Company</th>
            <th>Date-Time</th>
            <th>Search ID</th>
            <th>Name of Search</th>
            <th>Search Details</th>
            <th style={{ width: "120px" }}>Email Count</th>
            <th>Direct Dial Count</th>
            <th>Email Cost</th>
            <th>Direct Dial Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {freezeHistory.data.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center p-4">
                <h5>No data found!!!</h5>
              </td>
            </tr>
          )}
          {freezeHistory.data.map((fh) => {
            return (
              <>
                <tr key={fh.search_id} id={fh.search_id}>
                  <td></td>
                  <td></td>
                  <td>{fh.date ? new Date(fh.date).toLocaleString() : ""}</td>
                  <td>{fh.search_id}</td>
                  <td>{fh.search_name}</td>
                  <td>
                    {fh.search_details.first_name ? (
                      <div>
                        First Name: {String(fh.search_details.first_name)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.last_name ? (
                      <div>
                        Last Name: {String(fh.search_details.last_name)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.title ? (
                      <div>Title: {String(fh.search_details.title)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.city ? (
                      <div>City: {String(fh.search_details.city)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.state ? (
                      <div>State: {String(fh.search_details.state)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.country ? (
                      <div>Country: {String(fh.search_details.country)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.seniority_level ? (
                      <div>
                        Seniority: {String(fh.search_details.seniority_level)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.company_city ? (
                      <div>
                        Company City: {String(fh.search_details.company_city)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.company_state ? (
                      <div>
                        Company State: {String(fh.search_details.company_state)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.company_country ? (
                      <div>
                        Company Country:{" "}
                        {String(fh.search_details.company_country)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.company_name ? (
                      <div>
                        Company Name: {String(fh.search_details.company_name)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.company_size_range ? (
                      <div>
                        Company Size Range:{" "}
                        {String(fh.search_details.company_size_range)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.revenue_range ? (
                      <div>
                        Revenue Range: {String(fh.search_details.revenue_range)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.department ? (
                      <div>
                        Department: {String(fh.search_details.department)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.industry ? (
                      <div>Industry: {String(fh.search_details.industry)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.domain ? (
                      <div>Domain: {String(fh.search_details.domain)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_details.keyword ? (
                      <div>Keyword: {String(fh.search_details.keyword)}</div>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {fh.email_count}
                    {fh.email_count !== 0 && (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Remove Emails</Tooltip>}
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-close float-end"
                          onClick={() => {
                            window.confirm(
                              "Do you really want to remove emails from this search?"
                            );
                          }}
                        ></button>
                      </OverlayTrigger>
                    )}
                  </td>
                  <td>
                    {fh.directDial_count}
                    {fh.directDial_count !== 0 && (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Remove Direct Dials</Tooltip>}
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-close float-end"
                          onClick={() => {
                            window.confirm(
                              "Do you really want to remove emails from this search?"
                            );
                          }}
                        ></button>
                      </OverlayTrigger>
                    )}
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {/* {fh.email_count === 0
                      ? 0
                      : "₹ " + priceCalulator(fh.email_count)} */}
                    {fh.email_cost}
                  </td>
                  <td className="text-end">
                    {fh.directDial_count === 0
                      ? 0
                      : "₹ " + direactDialPrice(fh.directDial_count)}
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteFreezeData(fh.search_id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <div></div>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => {
            openModal("finalFreezeModal");
          }}
          disabled={freezeHistory.data.length === 0 ? true : false}
        >
          Freeze
        </button>
      </div>

      <div
        className="modal fade"
        id="finalFreezeModal"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-body">
              <h5>
                Is this your final selection , or you want to search more data?
              </h5>
              <div className="my-3">
                <button className="btn btn-success me-2">
                  Yes, this is my final selection- Please take me to billing
                </button>
                <br />
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => {
                    closeModal("finalFreezeModal");
                    closeHistoryModal();
                    backToSearch();
                  }}
                >
                  No, I want to buy more data. Take me to fresh search
                </button>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => closeModal("finalFreezeModal")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop"
        id="modal-backdrop-FreezeHistoryTable"
        style={{ display: "none", opacity: ".5" }}
      ></div>
    </>
  );
}

export default FreezeHistoryTable;
