import React from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "axios";
import { watchList, userInfo } from "../../states/action-creator";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

const TableRow = (props) => {
  const dispatch = useDispatch();

  const { TableData, showCompanyInfo, selectAll, showAllContacts, planId } =
    props;

  const toogleSelectAll = (selectAll) => {
    var checkboxes = document.getElementsByClassName("selectContacts");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = selectAll;
    }
  };

  toogleSelectAll(selectAll);

  const refreshWatchlist = async () => {
    console.log("Refresh watchlist");
    await axios({
      method: "GET",
      url: `${API_URL}/api/contacts/watchlist?page=1&limit=25`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          dispatch(watchList(response.data));
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const initiateUserInfo = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/api/auth/getuser`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          dispatch(userInfo(response.data.userdata));
          // localStorage.removeItem("searchQuery");
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const addToWatchList = async (personId) => {
    const watchList = await fetch(`${API_URL}/api/contacts/unlock`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cid: personId })
    });
    const res = await watchList.json();
    if (res.status === "success") {
      refreshWatchlist();
      let badge = "";
      if (res.data.email_confidence_level === "Valid") {
        badge =
          '<span class="badge text-white bg-success small"><i class="fas fa-check-circle me-1" title="Verified"></i> Verified</span>';
      } else if (res.data.email_confidence_level === "catchall") {
        badge = '<span class="badge bg-secondary">Guessed / Recommended</span>';
      }

      let unlockContainer = document.getElementById("unlock_" + personId);
      unlockContainer.innerHTML = `${res.data.email.toLowerCase()} <br>${badge} <span class="ms-2" style="cursor: pointer" onClick="copyEmail(${
        res.data.email
      })"><i class="far fa-copy"></i></span>`;
      if (planId === 3) {
        toast.success("Contact unlocked successfully");
      } else {
        toast.success("Contact added to watchlist");
      }
      initiateUserInfo();
    } else if (res.status === "exist") {
      toast.warning(res.msg);
    } else if (res.status === "limit_reached") {
      toast.error(res.msg);
    }
  };

  return (
    <>
      {TableData.map((data) => {
        return (
          <tr key={data._id}>
            <td className="name_of_contact align-middle">
              <div className="d-flex align-items-center">
                <span className="me-3">
                  <input
                    type="checkbox"
                    className="form-check-input mt-0 selectContacts"
                    value={data._id}
                    data-unlocked={data.unlocked_email}
                    disabled={planId === 3 ? true : false}
                  />
                </span>
                <span>
                  <div className="fw-bold text-capitalize">
                    {data.first_name} {data.last_name}
                    <div className="table_social_link ms-2 d-inline">
                      {linkedCorrection(data.linkedin_id)}
                    </div>
                  </div>
                  <div className="small text-primary fw-bold">{data.title}</div>
                </span>
              </div>
            </td>
            <td className="name_of_company align-middle">
              {data.organization.organization_name && (
                <strong
                  className="show_company"
                  data-name=""
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    showCompanyInfo(data.company_id);
                  }}
                >
                  {data.organization.organization_name}
                </strong>
              )}
              <div className="table_social_link mt-1">
                {websiteCorrection(data.organization.website_link)}
                {linkedCorrection(data.organization.org_linkedin_url)}
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>View Company Profile</Tooltip>}
                >
                  <a
                    href="#cloud"
                    onClick={(e) => {
                      e.preventDefault();
                      showCompanyInfo(data.company_id);
                    }}
                  >
                    <i className="fas fa-eye small"></i>
                  </a>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>View all contacts from this company</Tooltip>
                  }
                >
                  <a
                    href="#cloud"
                    onClick={(e) => {
                      e.preventDefault();
                      showAllContacts(data.organization.company_id);
                    }}
                  >
                    <i className="fas fa-user"></i>
                  </a>
                </OverlayTrigger>
                <span className="mx-2">|</span>
                <span className="text-capitalize small text-primary fw-bold">
                  {data.organization.industry}
                </span>
                <span className="mx-2">|</span>
                <span className="small fw-bold">
                  {data.organization.size_range}
                </span>
              </div>
            </td>
            {/* <td className="industry align-middle text-capitalize"></td>
            <td className="head-count align-middle"></td> */}
            <td
              className="align-middle email"
              id={`unlock_${data._id}`}
              nowrap="true"
            >
              {data.unlocked_email === "yes" && (
                <span className="badge bg-success">
                  Already moved to watchlist
                </span>
              )}
              {data.unlocked_email === "no" && (
                <span
                  className="btn btn-sm bg-success text-light py-0 px-1"
                  onClick={() => {
                    addToWatchList(data._id);
                  }}
                >
                  <i className="fas fa-envelope"></i> Get Email
                </span>
              )}
            </td>
            <td className="align-middle">
              {data.direct_dial === "available" ? (
                <span className="badge bg-success">Available</span>
              ) : (
                <span className="badge bg-danger">Not Available</span>
              )}
            </td>
            <td className="align-middle">
              <div style={{ height: "45px", overflow: "hidden" }}>
                {data.organization.primary_phone}
              </div>
            </td>
            <td className="align-middle">
              <strong>{data.country}</strong>
              <br />
              {data.city}
            </td>
            <td className="align-middle">
              <strong>{data.organization.org_country}</strong>
              <br />
              {data.organization.org_city}
            </td>
          </tr>
        );
      })}
    </>
  );
};

function websiteCorrection(link) {
  var c;
  if (link) {
    c = link.replace(/http\/\//g, "");
    if (!c.match(/^[a-zA-Z]+:\/\//)) {
      c = "http://" + c;
    }
    return (
      <OverlayTrigger placement="bottom" overlay={<Tooltip>Website</Tooltip>}>
        <a
          href={c}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fas fa-globe"></i>
        </a>
      </OverlayTrigger>
    );
  }
  return "";
}

function linkedCorrection(link) {
  var c;
  if (link) {
    c = link.replace(/http\/\//g, "");
    if (!c.match(/^[a-zA-Z]+:\/\//)) {
      c = "http://" + c;
    }
    if (c.match(/linkedin\.com/)) {
      return (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Linkedin Link</Tooltip>}
        >
          <a
            href={c}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title=""
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </OverlayTrigger>
      );
    }
  }
  return "";
}

export default TableRow;
