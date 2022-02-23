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
            {data.organization_name}
          </strong>
          <div className="table_social_link mt-1">
            <a
              href={`//${data.website_link}`}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Website"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fas fa-globe"></i>
            </a>
            <a
              href={data.org_linkedin_url}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Linkedin Link"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="#cloud"
              title="Show Contacts"
              onClick={(e) => {
                e.preventDefault();
                showContacts(data.organization_name);
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
        <td className="industry align-middle">{data.industry}</td>
        <td className="head-count align-middle">
          {data.estimated_employees_headcount}
        </td>
        <td className="align-middle">
          <strong>{data.org_country}</strong>
          <br />
          {data.org_city}
        </td>
      </tr>
    </>
  );
};

export default TableRow;
