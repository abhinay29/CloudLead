import React, { useEffect, useState } from 'react'
import Pagination from "react-js-pagination";
import TableRow from './TableRow'

const API_URL = process.env.REACT_APP_API_URL;

const Watchlist = () => {
  const [watchList, setWatchList] = useState([])
  const [page, setPage] = useState(1);
  const [people, setPeople] = useState(0)
  const [uniqueComp, setUniqueComp] = useState(0)

  const handlePageChange = (pageNumber) => {
    getWatchlist(pageNumber)
  }

  const getWatchlist = async (pageNumber) => {
    setPage(pageNumber);
    const url = `${API_URL}/api/contacts/watchlist?page=${pageNumber}`;
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    let parsedData = await data.json()
    if (parsedData.status === 'success') {
      if (parsedData.totalResults !== 0) {
        setPeople(parsedData.totalResults)
        setWatchList(parsedData)
      }
    }
  }

  useEffect(() => {
    getWatchlist(page);
  }, [page])

  return (
    <div>
      <div className="card-body" id="result_body">
        <div className="mb-2 d-flex">
          <div className="me-auto">
            <span className="small fw-bold text-primary me-2">CONTACTS (<span>{people}</span>)</span>
            <span className="small fw-bold text-primary">UNIQUE COMPANIES (<span>{uniqueComp}</span>)</span>
          </div>
          <div id="no_selected_contact"></div>
        </div>
        <div className="mb-1 d-flex">
          <div className="btn-group me-2" role="group" aria-label="Menu">
            <span className="dropdown bi-tooltip" data-bs-placement="top" title="Select">
              <button className="btn btn-sm btn-outline-primary dropdown-toggle" type="button" id="selectDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <input type="checkbox" className="form-check-input" />
              </button>
              <ul className="dropdown-menu" aria-labelledby="selectDropdown">
                <li><a className="dropdown-item select_contact" data-select="50" href="#">Select 50</a></li>
                <li><a className="dropdown-item select_contact" data-select="100" href="#">Select 100</a></li>
                <li><a className="dropdown-item select_contact" data-select="2000" href="#">Select 2000</a></li>
                <li><a className="dropdown-item select_contact" data-select="5000" href="#">Select 5000</a></li>
                <li><a className="dropdown-item select_contact" data-select="10000" href="#">Select 10000</a></li>
                <li><a className="dropdown-item select_contact" data-select="0" href="#">Clear Selection</a></li>
              </ul>
            </span>
            <button type="button" className="btn btn-sm btn-outline-primary text-success bi-tooltip" id="export_csv" data-bs-placement="top" title="Export CSV"><i className="fas fa-download"></i></button>
            <button type="button" className="btn btn-sm btn-outline-primary text-danger bi-tooltip" data-bs-placement="top" title="Delete Contact(s)"><i className="far fa-trash-alt"></i></button>
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" title="Add to list"><i className="fas fa-plus"></i></button>
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" title="Refresh" onClick={() => { window.location.reload() }}><i className="fas fa-sync-alt"></i></button>
          </div>
          <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip me-2" title="Search" data-bs-toggle="modal" data-bs-target="#search_modal"><i className="fas fa-search"></i> Search</button>

          <div className="ms-3 d-flex mt-1 position-relative">

            <div className="position-absolute text-uppercase" style={{ "top": "-35px", "left": "0" }}>
              <span className="small fw-bold text-primary">Email Confidence Level</span>
            </div>

            <div className="me-3">
              <input type="checkbox" id="high_confidence" className="form-check-input me-1 confidence_level" value="high" />
              <label htmlFor="high_confidence" className="form-check-label">Verified</label>
            </div>

            <div className="me-3">
              <input type="checkbox" id="low_confidence" className="form-check-input me-1 confidence_level" value="Catchall/Accept_all" />
              <label htmlFor="low_confidence" className="form-check-label">Catch all / Accept all</label>
            </div>

            <div className="me-3">
              <input type="checkbox" id="guessed_confidence" className="form-check-input me-1 confidence_level" value="Guessed/Recommended" />
              <label htmlFor="guessed_confidence" className="form-check-label">Guessed / Recommended</label>
            </div>
          </div>

        </div>
        <div className="table-responsive border-bottom" style={{ "height": "calc(100vh - 210px)", "overflowY": "scroll", "padding": "0 10px", "margin": "0 -10px" }}>
          <table className="table table-borderless tableFixHead mb-0" id="peopleTable">
            <thead>
              <tr>
                <th>
                  <div className="d-flex align-items-center">
                    <input type="checkbox" id="selectall" className="form-check-input mt-0 me-3" />
                    <span>Person's Name</span>
                  </div>
                </th>
                <th>Action</th>
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
              {watchList.length !== 0 ?
                watchList.peoples.map((data) => {
                  return <TableRow key={data._id} data={data} />
                }) : <tr><td colSpan="11" className="text-center py-2" ><h5 className="mb-0">No record found</h5></td></tr>
              }
            </tbody>
          </table>
        </div>
        <div className="mt-3 d-flex align-items-center">
          <div>
            <select name="no_of_contact" id="no_of_contact" className="form-select form-control-sm">
              <option value="50">50 Contact</option>
              <option value="100">100 Contact</option>
            </select>
          </div>
          <nav className="ms-auto d-flex align-items-center">
            <Pagination
              activePage={page}
              itemsCountPerPage={50}
              totalItemsCount={people}
              pageRangeDisplayed={7}
              onChange={handlePageChange}
              activeclassName="active"
              itemclassName="page-item"
              innerclassName="pagination mb-0"
              linkclassName="page-link"
              firstPageText="First"
              lastPageText="Last"
              prevPageText="Previous"
              nextPageText="Next"
              disabledclassName="disabled"
              activeLinkclassName="disabled"
            />
          </nav>
        </div>
      </div>
    </div >
  )
}

export default Watchlist
