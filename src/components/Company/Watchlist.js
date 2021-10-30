import React, { useEffect, useState } from 'react'
import Pagination from "react-js-pagination";
import WatchListTableRow from './WatchListTableRow'
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { progressLoading } from '../../states/action-creator';
import ContactTableRow from '../People/TableRow'

const API_URL = process.env.REACT_APP_API_URL;

const Watchlist = () => {

  const dispatch = useDispatch()

  const [watchList, setWatchList] = useState([])
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState(0)
  const [selectAll] = useState(false);
  const [totalContacts, setTotalContacts] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [peoples, getPeoples] = useState([]);
  const [pageContact, setPageContact] = useState(1);

  // eslint-disable-next-line

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== page) {
      dispatch(progressLoading(50))
      getWatchlist(pageNumber)
      dispatch(progressLoading(100))
    }
  }

  const getWatchlist = async (pageNumber = 1, query = '') => {
    setPage(pageNumber);
    dispatch(progressLoading(30))
    const url = `${API_URL}/api/companies/w/watchlist?page=${pageNumber}${query}`;
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    dispatch(progressLoading(60))
    let parsedData = await data.json()
    if (parsedData.status === 'success') {
      if (parsedData.totalResults !== 0) {
        setCompanies(parsedData.totalResults)
        setWatchList(parsedData)
      } else {
        setCompanies(0)
        setWatchList([])
      }
    }
    dispatch(progressLoading(100))
  }

  useEffect(() => {
    getWatchlist();
  }, [])

  const [company_info, setCompInfo] = useState({})

  const getCompanyInfo = async (comp_name) => {

    dispatch(progressLoading(30))

    const data = await fetch(`${API_URL}/api/companies/${comp_name}`)

    dispatch(progressLoading(60))

    const CompData = await data.json()

    dispatch(progressLoading(100))

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

  const deleteContact = async () => {

    let selectedId = []
    var checkboxes = document.getElementsByClassName('selectContacts')
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked)
        selectedId.push(checkboxes[i].value);
    }
    if (selectedId.length === 0) {
      NotificationManager.error("Please select people to delete from watchlist");
      return false;
    }
    dispatch(progressLoading(30))
    const bulkDelete = await fetch(`${API_URL}/api/contacts/deletewatchlist`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        ids: selectedId
      })
    })
    if (!bulkDelete) { dispatch(progressLoading(100)); return false }
    dispatch(progressLoading(60))
    const res = await bulkDelete.json();

    if (res.status === 'success') {
      getWatchlist()
      NotificationManager.success(`${res.deletedCount} contacts deleted from watchlist`, "Success!", 3000);
    } else {
      NotificationManager.error('Something went wrong, please try again later.');
    }
    dispatch(progressLoading(100))
    return true;
  }

  const handleContactPageChange = (pageNumber) => {
    if (pageContact !== pageNumber) {
      showContacts(companyName, pageNumber)
    }
  }

  const showContacts = async (company_name, pageNumber = 1) => {
    setPageContact(pageNumber);
    dispatch(progressLoading(10))
    let query;
    query = 'company_name=' + company_name
    const url = `${API_URL}/api/contacts?${query}&page=${pageNumber}`;
    const watchList = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
    })
    dispatch(progressLoading(50))
    const res = await watchList.json();
    if (res.status === 'success') {
      if (res.totalResults === 0) {
        NotificationManager.error('No result found');
        return
      }
      setTotalContacts(res.totalResults);
      getPeoples(res.data.contacts)
      setCompanyName(company_name);
      openModal('showContactModal');
    }
    dispatch(progressLoading(100))
  }

  return (
    <div>
      <div className="card-body" id="result_body">
        <div className="mb-2 d-flex">
          <div className="me-auto">
            <span className="small fw-bold text-primary">UNIQUE COMPANIES (<span>{companies}</span>)</span>
          </div>
          <div id="no_selected_contact"></div>
        </div>
        <div className="mb-2 d-flex">
          <div className="btn-group me-2" role="group" aria-label="Menu">
            <button type="button" className="btn btn-sm btn-outline-primary text-danger bi-tooltip" data-bs-placement="top" title="Delete Contact(s)" onClick={() => { deleteContact() }}><i className="far fa-trash-alt"></i></button>
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" title="Refresh" onClick={() => { window.location.reload() }}><i className="fas fa-sync-alt"></i></button>
          </div>
          <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip me-2" onClick={() => window.history.back()}><i className="fas fa-reply"></i> Back</button>
          {/* <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip me-2" title="Search" data-bs-toggle="modal" data-bs-target="#search_modal"><i className="fas fa-search"></i> Search</button> */}

        </div>
        <div className="table-responsive border" style={{ "height": "calc(100vh - 215px)", "overflowY": "scroll" }}>
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
              {watchList.length !== 0 ?
                <WatchListTableRow TableData={watchList.companies} showCompanyInfo={getCompanyInfo} showContacts={showContacts} />
                : <tr><td colSpan="11" className="text-center py-2" ><h5 className="mb-0">No record found</h5></td></tr>
              }
            </tbody>
          </table>
        </div>
        <div className="mt-3 d-flex align-items-center">
          <div>
            <select name="no_of_contact" id="no_of_contact" className="form-select form-control-sm">
              <option value="25">25 Companies</option>
              <option value="50">50 Companies</option>
            </select>
          </div>
          <nav className="ms-auto d-flex align-items-center">
            <Pagination
              activePage={page}
              itemsCountPerPage={25}
              totalItemsCount={companies}
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

      <div className="modal" id="showContactModal" tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <p className="text-primary position-absolute">Total Contacts: {totalContacts}</p>
              <h5 className="modal-title w-100 text-center">{companyName}</h5>
              <button type="button" className="btn-close" onClick={() => closeModal('showContactModal')} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive border-bottom"
                style={{ "height": "calc(100vh - 150px)", "overflowY": "scroll", "padding": "0 10px", "margin": "0 -10px" }}
              >
                <table className="table table-borderless tableFixHead mb-0" id="peopleTable">
                  <thead>
                    <tr>
                      <th>
                        <div className="d-flex align-items-center">
                          <input type="checkbox" id="allSelector" onClick={(e) => { return false; }} className="form-check-input mt-0 me-3" />
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
                      <ContactTableRow
                        TableData={peoples}
                        closeModal={closeModal}
                        showCompanyInfo={() => { return false }}
                        selectAll={false}
                      />
                    }
                  </tbody>
                </table>
              </div>
              <div className="mt-3 d-flex align-items-end">
                <nav className="ms-auto d-flex align-items-center">
                  <Pagination
                    activePage={pageContact}
                    itemsCountPerPage={50}
                    totalItemsCount={totalContacts}
                    pageRangeDisplayed={7}
                    onChange={handleContactPageChange}
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
          </div>
        </div>
      </div>

      <div className="modal-backdrop" id="modal-backdrop" style={{ "display": "none", "opacity": ".5" }}></div>

    </div >
  )
}

export default Watchlist
