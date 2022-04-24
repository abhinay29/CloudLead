import React from "react";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

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
    var price = 0;
    if (ec > 2000) {
      price = 2000 * 2.5;
      if (ec < 5000) {
        var remain = ec - 2000;
        var remainPrice = remain * 1.75;
        price = price + remainPrice;
      } else if (ec > 5000 && ec <= 10000) {
        var remain = ec - 2000 - 5000;
        var remainPrice = remain * 1;
      } else if (ec > 10000 && ec <= 20000) {
        var remain = ec - 2000 - 5000;
        var remainPrice = remain * 1;
        price = price + remainPrice;
        remain = ec - 2000 - 5000 - 10000;
        remainPrice = remain * 0.7;
        price = price + remainPrice;
      }
    } else {
      price = ec * 2.5;
    }
    return price;
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
                    ₹ {priceCalulator(fh.email_count)}
                  </td>
                  <td className="text-end">0</td>
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
