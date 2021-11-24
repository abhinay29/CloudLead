import React from 'react'
import { NotificationManager } from 'react-notifications';

const API_URL = process.env.REACT_APP_API_URL;

const TableRow = (props) => {

  const { TableData, showCompanyInfo, selectAll, showAllContacts } = props;

  const toogleSelectAll = (selectAll) => {
    var checkboxes = document.getElementsByClassName('selectContacts')
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = selectAll;
    }
  }

  toogleSelectAll(selectAll)

  const addToWatchList = async (personId) => {
    const watchList = await fetch(`${API_URL}/api/contacts/unlock`, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cid: personId })
    })
    const res = await watchList.json();
    if (res.status === 'success') {
      let badge = '';
      if (res.data.primary_mai_confidence === 'High' || res.data.primary_mai_confidence === 'Verified') {
        badge = '<span class="badge text-white bg-success small"><i class="fas fa-check-circle me-1" title="Verified"></i> Verified</span>';
      } else if (res.data.primary_mai_confidence === 'Low' || res.data.primary_mai_confidence === 'Catchall/Accept_all') {
        badge = '<span class="badge bg-secondary">Catch all / Accept all</span>';
      } else if (res.data.primary_mai_confidence === 'Guessed' || res.data.primary_mai_confidence === 'Guessed/Recommended') {
        badge = '<span class="badge" style="background: #f57c00"> Guessed / Recommended</span>';
      }

      let unlockContainer = document.getElementById('unlock_' + personId);
      unlockContainer.innerHTML = `${res.data.primary_email} <br>${badge} <span class="ms-2" style="cursor: pointer"><i class="far fa-copy"></i></span>`;
      NotificationManager.success('Contact added to watchlist', "Success!", 2000);
    } else if (res.status === 'exist') {
      NotificationManager.warning(res.msg);
    } else if (res.status === 'limit_reached') {
      NotificationManager.error(res.msg);
    }
  }

  return (
    <>
      {TableData.map(data => {
        return (
          <tr key={data._id}>
            <td className="name_of_contact align-middle">
              <div className="d-flex align-items-center">
                <span className="me-3">
                  <input type="checkbox" className="form-check-input mt-0 selectContacts" value={data._id} data-unlocked={data.unlocked_email} />
                </span>
                <span>
                  <div className="fw-bold text-capitalize">{data.first_name} {data.last_name}</div>
                  <div className="text-muted">{data.position}</div>
                  <div className="table_social_link mt-1">
                    <a href={data.linkedin_profile} target="_blank" rel="noreferrer" data-bs-toggle="tooltip" data-bs-placement="top" title="Linkedin Profile"><i className="fab fa-linkedin-in"></i></a>
                  </div>
                </span>
              </div>
            </td>
            {/* <td className="title align-middle">{data.position}</td> */}
            <td className="name_of_company align-middle">
              <strong className="show_company" data-name="21st Century Software Solutions Pvt Ltd" style={{ "cursor": "pointer" }} onClick={() => { showCompanyInfo(data.company_name) }} >{data.company_name}</strong>
              <div className="table_social_link mt-1">
                <a href={`http://${data.website}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Website" target="_blank" rel="noreferrer"><i className="fas fa-globe"></i></a>
                <a href={data.linkedin_link} data-bs-toggle="tooltip" data-bs-placement="top" title="Linkedin Link" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" onClick={(e) => { e.preventDefault(); showCompanyInfo(data.company_name) }} title="View Company Profile"><i className="fas fa-eye small"></i></a>
                <a href="#" title="Show all contacts from this company" onClick={(e) => { e.preventDefault(); showAllContacts(data.company_name) }}><i className="fas fa-user"></i></a>
              </div>
            </td>
            <td className="industry align-middle">{data.industry}</td>
            <td className="head-count align-middle">{data.company_size_range}</td>
            <td className="align-middle email" id={`unlock_${data._id}`} nowrap="true">
              {data.unlocked_email === 'yes' && <span className="badge bg-success">Already moved to watchlist</span>}
              {data.unlocked_email === 'no' &&
                <span className="btn btn-sm btn-primary" onClick={() => { addToWatchList(data._id) }}>
                  <i className="fas fa-envelope"></i> Get Contact
                </span>}
            </td>
            <td className="align-middle"><div style={{ "height": "45px", "overflow": "hidden" }}>{data.boardline_numbers}</div></td>
            <td className="align-middle"><span className="badge bg-primary">Contact Us</span></td>
            <td className="align-middle"><strong>{data.person_country}</strong><br />{data.person_city}</td>
            <td className="align-middle"><strong>{data.company_country}</strong><br />{data.company_city}</td>
          </tr>
        )
      })}
    </>
  )
}

export default TableRow
