import React from "react";

const TableRow = (props) => {
  const { data, showCompanyInfo, saveCompany, showContacts } = props;

  return (
    <>
      <tr>
        <td className="name_of_company align-middle">
          <strong
            className="show_company"
            style={{ cursor: "pointer" }}
            onClick={() => {
              showCompanyInfo(data.company_id);
            }}
          >
            {data.organization_name ? data.organization_name : "--"}
          </strong>
          <div className="table_social_link mt-1">
            {websiteCorrection(data.website_link)}
            {linkedCorrection(data.org_linkedin_url)}
            <a
              href="#cloud"
              title="Show Contacts"
              onClick={(e) => {
                e.preventDefault();
                showContacts(data.company_id);
              }}
            >
              <i className="fas fa-user"></i>
            </a>
            <a
              href="#cloud"
              onClick={(e) => {
                e.preventDefault();
                showCompanyInfo(data.company_id);
              }}
              title="View Company Profile"
            >
              <i className="fas fa-eye"></i>
            </a>
            <a
              href="#cloud"
              onClick={(e) => {
                e.preventDefault();
                saveCompany(data._id);
              }}
            >
              <i className="fas fa-plus small"></i>
            </a>
          </div>
        </td>
        <td className="industry align-middle text-capitalize">
          {data.industry}
        </td>
        <td className="head-count align-middle">{data.size_range}</td>
        <td className="align-middle">
          <strong>{data.org_country ? data.org_country : "--"}</strong>
          <br />
          {data.org_city ? data.org_city : "--"}
        </td>
      </tr>
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
