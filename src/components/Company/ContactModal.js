import React from 'react'
import PeopleContext from '../Context/People/PeopleContext';
import Pagination from "react-js-pagination";
import ContactTableRow from '../People/TableRow'
import { Link } from 'react-router-dom';


function ContactModal() {

  const peopleContext = useContext(PeopleContext)
  const { peoples, getPeoples, totalPeople, setTotalPeople, uniqueComp } = peopleContext;

  const searchPeople = async (pageNumber = 1) => {
    setPage(pageNumber);
    let query = localStorage.getItem('searchQuery') + `&page=${pageNumber}`;

    if (query.length === 0) {
      return
    }
    dispatch(progressLoading(30))
    const url = `${API_URL}/api/contacts?${query}&limit=${limit}`;
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    dispatch(progressLoading(50))
    let parsedData = await data.json()
    if (parsedData.status === 'success') {
      if (parsedData.totalResults === 0) {
        alert('No result found');
        return
      }
      getPeoples(parsedData)
    }
    dispatch(progressLoading(100))
  }

  return (
    <div>
      <div className="card-body" id="result_body">
        <div className="mb-2 d-flex">
          <div className="me-auto">
            <span className="small fw-bold text-primary me-2">CONTACTS (<span>{totalPeople}</span>)</span>
            <span className="small fw-bold text-primary">UNIQUE COMPANIES (<span>{uniqueComp}</span>)</span>
          </div>
          <div id="no_selected_contact" className="text-primary"></div>
        </div>
        <div className="mb-1">
          <div className="btn-group me-2" role="group" aria-label="Menu">
            <span className="dropdown bi-tooltip" data-bs-placement="top" title="Select">
              <button className="btn btn-sm btn-outline-primary dropdown-toggle" type="button" id="selectDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <input type="checkbox" className="form-check-input" />
              </button>
              <ul className="dropdown-menu" aria-labelledby="selectDropdown">
                <li><a className="dropdown-item select_contact" data-select="50" href="/">Select 50</a></li>
                <li><a className="dropdown-item select_contact" data-select="100" href="/">Select 100</a></li>
                <li><a className="dropdown-item select_contact" data-select="0" href="/">Clear Selection</a></li>
              </ul>
            </span>
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" title="Add to list"><i className="fas fa-plus"></i></button>
          </div>
          {/* <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip me-2" onClick={() => { getContacts() }} title="Get Contacts"><i className="fas fa-envelope"></i> Get Contacts</button> */}
          <Link to="/radar/people/watchlist" className="btn btn-sm btn-outline-primary me-2"><i className="fas fa-bookmark"></i> My Watchlist</Link>
        </div>

        <div className="table-responsive border-bottom" style={{ "height": "calc(100vh - 210px)", "overflowY": "scroll", "padding": "0 10px", "margin": "0 -10px" }}>
          <table className="table table-borderless tableFixHead mb-0" id="peopleTable">
            <thead>
              <tr>
                <th>
                  <div className="d-flex align-items-center">
                    <input type="checkbox" id="allSelector" onClick={(e) => { setSelectAll(e.target.checked) }} className="form-check-input mt-0 me-3" />
                    <span>Person's Name</span>
                  </div>
                </th>
                <th>Title</th>
                <th>Company</th>
                <th>Industry</th>
                <th>Head Count</th>
                <th>Email</th>
                <th>Boardline Numbers</th>
                <th>Direct Dial</th>
                <th>Contact Location</th>
                <th>Company Location</th>
              </tr>
            </thead>
            <tbody id="contactTable">
              {peoples.length !== 0 &&
                <ContactTableRow TableData={peoples.data.contacts} showCompanyInfo={getCompanyInfo} selectAll={selectAll} />
              }
            </tbody>
          </table>
        </div>
        <div className="mt-3 d-flex align-items-center">
          <div>
            <select name="no_of_contact" id="no_of_contact" onChange={(e) => changeViewLimit(e)} className="form-select form-control-sm">
              <option value="50" selected={limit === 50 ? true : false}>50 Contact</option>
              <option value="100" selected={limit === 100 ? true : false}>100 Contact</option>
            </select>
          </div>
          <nav className="ms-auto d-flex align-items-center">
            <Pagination
              activePage={page}
              itemsCountPerPage={limit}
              totalItemsCount={totalPeople}
              pageRangeDisplayed={7}
              onChange={handlePageChange}
              activeClass="active"
              itemClass="page-item"
              innerClass="pagination mb-0"
              linkClass="page-link"
              firstPageText="First"
              lastPageText="Last"
              prevPageText="Previous"
              nextPageText="Next"
              disabledClass="disabled"
              activeLinkClass="disabled"
            />
          </nav>
        </div>
      </div>

    </div >

  )
}

export default ContactModal
