import React, { useContext, useEffect, useState } from 'react'
import CompanyContext from '../Context/Company/CompanyContext';
import Pagination from "react-js-pagination";
import TableRow from './TableRow'

const API_URL = process.env.REACT_APP_API_URL;

const Table = (props) => {
  const context = useContext(CompanyContext);
  const { companies, getCompanies, totalComapany, setTotalComp } = context;
  const [page, setPage] = useState(1);
  const { setShowFilter, setShowTable } = props

  const backToSearch = () => {
    getCompanies([]);
    setShowFilter(true)
    setShowTable(false)
    setTotalComp(0)
  }

  const handlePageChange = (pageNumber) => {
    searchCompany(pageNumber)
  }

  const searchCompany = async (pageNumber) => {
    setPage(pageNumber);
    let query = localStorage.getItem('searchQuery') + `&page=${pageNumber}`;

    if (query.length === 0) {
      return
    }

    const url = `${API_URL}/api/companies?${query}`;
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    let parsedData = await data.json()
    if (parsedData.status === 'success') {
      if (parsedData.totalResults === 0) {
        alert('No result found');
        return
      }
      getCompanies(parsedData)
    }
  }

  const [company_info, setCompInfo] = useState({})


  const getCompanyInfo = async (comp_name) => {
    const data = await fetch(`${API_URL}/api/companies/${comp_name}`)
    const CompData = await data.json()

    if (CompData.status === 'success') {
      setCompInfo(CompData.comp_data)
      openModal('showCompany');
    }

  }

  const openModal = (modalId) => {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden'
    var modal = document.getElementById(modalId);
    modal.classList.add('show');
    modal.style.display = 'block';
    let modalBackdrop = document.getElementById('modal-backdrop');
    modalBackdrop.style.display = "block";
  }

  const closeModal = (modalId) => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'visible'
    document.body.style.padding = '0'
    var modal = document.getElementById(modalId);
    modal.classList.remove('show');
    modal.style.display = 'none';
    let modalBackdrop = document.getElementById('modal-backdrop');
    modalBackdrop.style.display = "none";
  }

  return (
    <div>
      <div className="card-body" id="result_body">
        <div className="mb-2 d-flex">
          <div className="me-auto">
            <span className="small fw-bold text-primary">UNIQUE COMPANIES (<span>{totalComapany}</span>)</span>
          </div>
          <div id="no_selected_contact"></div>
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
            {/* <button type="button" className="btn btn-sm btn-outline-primary"><i className="fas fa-plus small"></i></button> */}
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" data-bs-toggle="modal" data-bs-target="#saveSearchModal" title="Save Search Query"><i className="far fa-save"></i></button>
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" title="Add to list"><i className="fas fa-plus"></i></button>
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" title="Refresh"><i className="fas fa-sync-alt"></i></button>
          </div>
          <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip me-2" title="Back to Search" onClick={backToSearch}><i className="fas fa-search"></i> Back to Search</button>
          <a href="mywatchlist" className="btn btn-sm btn-outline-primary me-2"><i className="fas fa-bookmark"></i> My Watchlist</a>
        </div>

        <div className="table-responsive border-bottom" style={{ "height": "calc(100vh - 210px)", "overflowY": "scroll", "padding": "0 10px", "margin": "0 -10px" }}>
          <table className="table table-borderless tableFixHead mb-0" id="peopleTable">
            <thead>
              <tr>
                <th>Name of Company</th>
                <th>Action</th>
                <th>Industry</th>
                <th>Employee Head Count</th>
                <th>Company Location</th>
              </tr>
            </thead>
            <tbody id="contactTable">
              {companies.length !== 0 &&
                companies.data.companies.map((data) => {
                  return <TableRow key={data._id} data={data} showCompanyInfo={getCompanyInfo} />
                })
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
              totalItemsCount={totalComapany}
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

      <div className="modal fade" id="showCompany" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title" id="mod_comp_name">{company_info.company_name}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => closeModal('showCompany')} aria-label="Close"></button>
            </div>
            <div className="modal-body" id="ext_body">
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <p className="fw-bold mb-1">Website</p>
                  <p className="text-break"><a href={`//${company_info.domain}`} rel="noreferrer" id="ext_website" target="_blank">{company_info.domain}</a></p>
                  <p className="fw-bold mb-1">Linkedin</p>
                  <p className="text-break"><a href={company_info.linkedin_link} rel="noreferrer" id="ext_linkedin_link" target="_blank">{company_info.linkedin_link}</a></p>
                  <p className="fw-bold mb-1">Founded</p>
                  <p id="ext_founded">{company_info.founded}</p>
                </div>
                <div className="col-md-6 col-lg-6">
                  <p className="fw-bold mb-1">Industry</p>
                  <p id="ext_industry">{company_info.industry}</p>
                  <p className="fw-bold mb-1">Size</p>
                  <p id="ext_size">{company_info.company_size_range}</p>
                  <p className="fw-bold mb-1">Revenue</p>
                  <p id="ext_revenue">{company_info.revenue_range}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-12">
                  <p className="fw-bold mb-1">Company Description</p>
                  <p id="ext_description">{company_info.description}</p>
                  <p className="fw-bold mb-1">Location</p>
                  <p id="ext_location">{company_info.company_city}, <strong>{company_info.company_country}</strong></p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => { closeModal('showCompany') }} data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" id="modal-backdrop" style={{ "display": "none", "opacity": ".5" }}></div>

    </div >
  )
}

export default Table
