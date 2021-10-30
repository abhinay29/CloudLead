import React from 'react'

const WatchListTableRow = (props) => {

  const { TableData, showCompanyInfo, showContacts } = props;

  return (
    <>
      {TableData.map(data => {
        return (
          <tr key={data._id} id={`wlrow_${data._id}`}>
            <td className="name_of_company align-middle">
              <strong className="show_company" data-name="21st Century Software Solutions Pvt Ltd" style={{ "cursor": "pointer" }} onClick={() => { showCompanyInfo(data.company_name) }} >{data.company_name}</strong>
              <div className="table_social_link mt-1">
                <a href={`//${data.website}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Website" target="_blank" rel="noreferrer"><i className="fas fa-globe"></i></a>
                <a href={data.linkedin_link} data-bs-toggle="tooltip" data-bs-placement="top" title="Linkedin Link" target="_blank" rel="noreferrer" className="ms-1"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" title="Show Contacts" onClick={(e) => { e.preventDefault(); showContacts(data.company_name) }}><i className="fas fa-user"></i></a>
                <a href="#" onClick={(e) => { e.preventDefault(); showCompanyInfo(data.company_name) }} title="View Company Profile"><i className="fas fa-eye"></i></a>
              </div>
            </td>
            <td className="actions align-middle"><button type="button" className="btn btn-sm btn-outline-secondary px-1 py-0"><i className="fas fa-trash small"></i> Remove</button></td>
            <td className="industry align-middle">{data.industry}</td>
            <td className="head-count align-middle">{data.company_size_range}</td>
            <td className="align-middle"><strong>{data.company_country}</strong><br />{data.company_city}</td>
          </tr>
        )
      })}
    </>
  )
}

export default WatchListTableRow
