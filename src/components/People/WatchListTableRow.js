import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Badge = (props) => {
  const { confidence } = props;
  let badge = "";
  if (confidence === "catchall") {
    badge = "catchall";
  } else if (confidence === "Valid") {
    badge = "valid";
  }

  return (
    <>
      {badge === "valid" && (
        <span className="badge text-white bg-success small">
          <i className="fas fa-check-circle me-1" title="Verified"></i> Verified
        </span>
      )}
      {badge === "catchall" && (
        <span className="badge bg-secondary" title="Guessed / Recommended">
          Guessed / Recommended
        </span>
      )}
    </>
  );
};

const WatchListTableRow = (props) => {
  const { TableData, showCompanyInfo, selectAll, showAllContacts } = props;

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
                    <div className="fw-bold text-capitalize">
                      {data.first_name} {data.last_name}
                      <div className="table_social_link ms-2 d-inline">
                        {linkedCorrection(data.linkedin_id)}
                      </div>
                    </div>
                    <div className="small text-primary fw-bold">
                      {data.title}
                    </div>
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
                        // showAllContacts(data.organization.company_id);
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
              <td className="align-middle">
                <span className="text-lowercase">{data.email}</span> <br />
                <Badge confidence={data.email_confidence_level} />
                <span className="ms-2" style={{ cursor: "pointer" }}>
                  <i className="far fa-copy"></i>
                </span>
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

export default WatchListTableRow;
