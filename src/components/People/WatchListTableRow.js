import React from "react";
// import { NotificationManager } from 'react-notifications';

const Badge = (props) => {
  const { confidence } = props;
  let badge = "";
  if (confidence === "valid" || confidence === "Valid") {
    badge = "high";
  } else if (
    confidence === "catchall" ||
    confidence === "Guessed / Recommended"
  ) {
    badge = "low";
  } else if (confidence === "guessed" || confidence === "") {
    badge = "guessed";
  }

  return (
    <>
      {badge === "high" && (
        <span className="badge text-white bg-success small">
          <i className="fas fa-check-circle me-1" title="Verified"></i> Verified
        </span>
      )}
      {badge === "low" && (
        <span className="badge bg-secondary" title="Guessed / Recommended">
          Guessed / Recommended
        </span>
      )}
      {badge === "guessed" && (
        <span
          className="badge"
          style={{ background: "#f57c00" }}
          title="Guessed"
        >
          Guessed / Recommended
        </span>
      )}
    </>
  );
};

const WatchListTableRow = (props) => {
  const { TableData, showCompanyInfo, selectAll } = props;

  const toogleSelectAll = (selectAll) => {
    var checkboxes = document.getElementsByClassName("selectContacts");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = false;
    }
    let length = selectAll.len;
    if (length === 25) {
      length = checkboxes.length > 25 ? selectAll.len : checkboxes.length;
    } else if (length === 50) {
      length = checkboxes.length < 50 ? checkboxes.length : selectAll.len;
    }
    if (length > checkboxes.length) {
      length = checkboxes.length;
    }
    for (var j = 0, m = length; j < m; j++) {
      checkboxes[j].checked = selectAll.select;
    }
  };

  toogleSelectAll(selectAll);

  return (
    <>
      {TableData &&
        TableData.map((data) => {
          return (
            <tr key={data._id} id={`wlrow_${data._id}`}>
              <td className="name_of_contact align-middle">
                <div className="d-flex align-items-center">
                  <span className="me-3">
                    <input
                      type="checkbox"
                      className="form-check-input mt-0 selectContacts"
                      value={data._id}
                    />
                  </span>
                  <span>
                    <div className="fw-bold">
                      {data.first_name} {data.last_name}
                      <div className="table_social_link ms-2 d-inline">
                        {linkedCorrection(data.linkedin_id)}
                      </div>
                    </div>
                    <div className="text-muted">{data.title}</div>
                    {/* <div className="table_social_link mt-1">
                      {linkedCorrection(data.linkedin_id)}
                    </div> */}
                  </span>
                </div>
              </td>
              <td className="name_of_company align-middle">
                <strong
                  className="show_company"
                  data-name="21st Century Software Solutions Pvt Ltd"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    showCompanyInfo(data.company_id);
                  }}
                >
                  {data.organization.organization_name}
                </strong>
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
                  <span className="mx-2">|</span>
                  <span className="text-capitalize">
                    {data.organization.industry}
                  </span>
                  <span className="mx-2">|</span>
                  <span>{data.organization.size_range}</span>
                </div>
              </td>
              <td className="align-middle" id={`unlock_${data._id}`}>
                {data.email} <br />
                <Badge confidence={data.email_confidence_level} />
                <span className="ms-2" style={{ cursor: "pointer" }}>
                  <i className="far fa-copy"></i>
                </span>
              </td>
              <td className="align-middle">
                <span className="badge bg-success">Available</span>
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
              <td className="align-middle">{data.date}</td>
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

export default WatchListTableRow;
