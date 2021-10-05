import React from 'react'
// import { NotificationManager } from 'react-notifications';

const Badge = (props) => {
  const { confidence } = props
  let badge = '';
  if (confidence === 'High' || confidence === 'Verified') {
    badge = 'high';
  } else if (confidence === 'Low' || confidence === 'Catchall/Accept_all') {
    badge = 'low';
  } else if (confidence === 'Guessed' || confidence === 'Guessed/Recommended') {
    badge = 'guessed';
  }

  return (
    <>
      {(badge === 'high') && <span className="badge text-white bg-success small"><i className="fas fa-check-circle me-1" title="Verified"></i> Verified</span>}
      {(badge === 'low') && <span className="badge bg-secondary">Catch all / Accept all</span>}
      {(badge === 'guessed') && <span className="badge" style={{ "background": "#f57c00" }}> Guessed / Recommended</span>}
    </>
  )
}

const WatchListTableRow = (props) => {

  const { TableData, showCompanyInfo, selectAll } = props;

  const toogleSelectAll = (selectAll) => {
    var checkboxes = document.getElementsByClassName('selectContacts')
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = selectAll;
    }
  }

  toogleSelectAll(selectAll)

  return (
    <>
      {TableData.map(data => {
        return (
          <tr key={data._id} id={`wlrow_${data._id}`}>
            <td className="name_of_contact align-middle">
              <div className="d-flex align-items-center">
                <span className="me-3">
                  <input type="checkbox" className="form-check-input mt-0 selectContacts" value={data._id} />
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
            <td className="head-count align-middle" nowrap="true">{data.company_size_range}</td>
            <td className="align-middle" id={`unlock_${data._id}`} nowrap="true">
              {data.primary_email} <br />
              <Badge confidence={data.primary_mai_confidence} />
              <span className="ms-2" style={{ "cursor": "pointer" }}><i className="far fa-copy"></i></span>
            </td>
            <td className="align-middle"><div style={{ "height": "40px", "overflow": "hidden" }}>{data.boardline_numbers}</div></td>
            <td className="align-middle"><span className="badge bg-primary">Contact Us</span></td>
            <td className="align-middle"><strong>{data.person_country}</strong><br />{data.person_city}</td>
            <td className="align-middle"><strong>{data.company_country}</strong><br />{data.company_city}</td>
          </tr>
        )
      })}
    </>
  )
}

export default WatchListTableRow
