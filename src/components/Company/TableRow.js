import React from 'react'

const TableRow = (props) => {

  const { data, showCompanyInfo, saveCompany, showContacts } = props;

  return (
    <>
      <tr>
        <td className="name_of_company align-middle">
          <strong className="show_company" data-name="21st Century Software Solutions Pvt Ltd" style={{ "cursor": "pointer" }} onClick={() => { showCompanyInfo(data.company_name) }} >{data.company_name}</strong>
          <div className="table_social_link mt-1">
            <a href={`//${data.website}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Website" target="_blank" rel="noreferrer"><i className="fas fa-globe"></i></a>
            <a href={data.linkedin_link} data-bs-toggle="tooltip" data-bs-placement="top" title="Linkedin Link" target="_blank" rel="noreferrer" className="ms-1"><i className="fab fa-linkedin-in"></i></a>
            <button type="button" className="btn btn-link text-secondary p-0 ms-1" title="Show Contacts" onClick={() => { showContacts(data.company_name) }} ><i className="fas fa-user"></i></button>
            <button type="button" className="btn btn-sm btn-outline-secondary ms-1 px-1 py-0" onClick={() => { showCompanyInfo(data.company_name) }} title="View Company Profile"><i className="fas fa-eye small"></i> View</button>
            <button type="button" className="btn btn-sm btn-outline-secondary ms-1 px-1 py-0" onClick={() => saveCompany(data._id)}><i className="fas fa-plus small"></i> Add</button>
          </div>
        </td>
        <td className="industry align-middle">{data.industry}</td>
        <td className="head-count align-middle">{data.company_size_range}</td>
        <td className="align-middle"><strong>{data.company_country}</strong><br />{data.company_city}</td>
      </tr>
    </>
  )
}

export default TableRow
