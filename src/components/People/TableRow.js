import React from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "axios";
import { watchList } from "../../states/action-creator";

const API_URL = process.env.REACT_APP_API_URL;

const TableRow = (props) => {
  const dispatch = useDispatch();

  const { TableData, showCompanyInfo, selectAll, showAllContacts } = props;

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
      if (
        res.data.email_confidence_level === "valid" ||
        res.data.email_confidence_level === "Valid"
      ) {
        badge =
          '<span class="badge text-white bg-success small"><i class="fas fa-check-circle me-1" title="Verified"></i> Verified</span>';
      } else if (
        res.data.email_confidence_level === "catchall" ||
        res.data.email_confidence_level === "Catchall/Accept_all"
      ) {
        badge =
          '<span class="badge bg-secondary">Catch all / Accept all</span>';
      } else if (
        res.data.email_confidence_level === "guessed" ||
        res.data.email_confidence_level === ""
      ) {
        badge =
          '<span class="badge" style="background: #f57c00"> Guessed / Recommended</span>';
      }

      let unlockContainer = document.getElementById("unlock_" + personId);
      unlockContainer.innerHTML = `${res.data.email.toLowerCase()} <br>${badge} <span class="ms-2" style="cursor: pointer" onClick="copyEmail(${
        res.data.email
      })"><i class="far fa-copy"></i></span>`;
      toast.success("Contact added to watchlist");
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
                  />
                </span>
                <span>
                  <div className="fw-bold text-capitalize">
                    {data.first_name} {data.last_name}
                    <div className="table_social_link ms-2 d-inline">
                      {linkedCorrection(data.linkedin_id)}
                    </div>
                  </div>
                  <div className="text-muted">{data.title}</div>
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
                <a
                  href="#cloud"
                  onClick={(e) => {
                    e.preventDefault();
                    showCompanyInfo(data.company_id);
                  }}
                  title="View Company Profile"
                >
                  <i className="fas fa-eye small"></i>
                </a>
                <a
                  href="#cloud"
                  title="Show all contacts from this company"
                  onClick={(e) => {
                    e.preventDefault();
                    showAllContacts(data.organization.company_id);
                  }}
                >
                  <i className="fas fa-user"></i>
                </a>
                <span className="mx-2">|</span>
                <span className="text-capitalize">
                  {data.organization.industry}
                </span>
                <span className="mx-2">|</span>
                <span>{data.organization.size_range}</span>
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
                  className="btn btn-sm btn-primary"
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
      <a
        href={c}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Website"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fas fa-globe"></i>
      </a>
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
        <a
          href={c}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Linkedin Link"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>
      );
    }
  }
  return "";
}

export default TableRow;
