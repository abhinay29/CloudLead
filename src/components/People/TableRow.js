import React from 'react'

const TableRow = (props) => {

  const { data, showCompanyInfo } = props;

  return (
    <>
      <tr>
        <td className="name_of_contact align-middle">
          <div className="d-flex align-items-center">
            <span className="me-3">
              <input type="checkbox" className="form-check-input mt-0 checkbox" value="614e6e778691c8351ad4e54b" />
            </span>
            <span>
              <span className="fw-bold">{data.first_name} {data.last_name}</span><br />
              <div className="table_social_link mt-1">
                <a href={data.linkedin_profile} target="_blank" rel="noreferrer" data-bs-toggle="tooltip" data-bs-placement="top" title="Linkedin Profile"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </span>
          </div>
        </td>
        <td className="title align-middle">{data.position}</td>
        <td className="name_of_company align-middle">
          <strong className="show_company" data-name="21st Century Software Solutions Pvt Ltd" style={{ "cursor": "pointer" }} onClick={() => { showCompanyInfo(data.company_name) }} >{data.company_name}</strong>
          <div className="table_social_link mt-1">
            <a href={data.website} data-bs-toggle="tooltip" data-bs-placement="top" title="Website" target="_blank" rel="noreferrer"><i className="fas fa-globe"></i></a>
            <a href={data.linkedin_link} data-bs-toggle="tooltip" data-bs-placement="top" title="Linkedin Link" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </td>
        <td className="industry align-middle">{data.industry}</td>
        <td className="head-count align-middle">{data.company_size_range}</td>
        <td className="align-middle email"><span className="unlock"><span className="btn btn-sm btn-primary"><i className="fas fa-envelope"></i> Get Contact</span></span></td>
        <td className="align-middle"><div style={{ "height": "40px", "overflow": "hidden" }}>{data.boardline_numbers}</div></td>
        <td className="align-middle"><span className="badge bg-primary">Contact Us</span></td>
        <td className="align-middle"><strong>{data.person_country}</strong><br />{data.person_city}</td>
        <td className="align-middle"><strong>{data.company_country}</strong><br />{data.company_city}</td>
      </tr>
    </>
  )
}

export default TableRow
