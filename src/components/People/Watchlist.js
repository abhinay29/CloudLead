import React, { useEffect, useState } from 'react'
import Pagination from "react-js-pagination";
import WatchListTableRow from './WatchListTableRow'
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { progressLoading } from '../../states/action-creator';
import WatchFilter from './WatchlistFilter';
import TableSkeleton from '../Skeleton/TableSkeleton';
import NoRecordFound from './NoRecordFound';

const API_URL = process.env.REACT_APP_API_URL;

const Watchlist = () => {

  const dispatch = useDispatch()

  const [watchList, setWatchList] = useState([])
  const [page, setPage] = useState(1);
  const [people, setPeople] = useState(0)
  const [selectAll, setSelectAll] = useState(false);
  // eslint-disable-next-line
  const [uniqueComp, setUniqueComp] = useState(0)
  const [disAddBtn, setDisAddBtn] = useState(false)
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== page) {
      dispatch(progressLoading(50))
      getWatchlist(pageNumber)
      dispatch(progressLoading(100))
    }
  }

  const searchWatchList = (query, pageNumber = 1) => {
    closeModal('searchModal');
    // console.log(query);
    getWatchlist(pageNumber, query);
  }

  const getWatchlist = async (pageNumber = 1, query = '') => {
    setPage(pageNumber);
    dispatch(progressLoading(30))
    const url = `${API_URL}/api/contacts/watchlist?page=${pageNumber}${query}`;
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
        setPeople(parsedData.totalResults)
        setWatchList(parsedData)
      } else {
        setPeople(0)
        setWatchList([])
      }
    }
    dispatch(progressLoading(100))
    setSkeletonLoading(false);
  }

  useEffect(() => {
    getWatchlist();
  }, [])

  const filterConfidence = () => {
    let confidence_checkbox = document.getElementsByClassName('confidence_level');
    let query = ''
    for (var i = 0, n = confidence_checkbox.length; i < n; i++) {
      if (confidence_checkbox[i].checked) {
        query += `&primary_mai_confidence=${confidence_checkbox[i].value}`
      }
    }
    getWatchlist(1, query);
  }

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

  const [newListName, setNewListName] = useState("");
  const [selectListName, setSelectListName] = useState("");

  const handlenewListName = (e) => {
    setNewListName(e.target.value);
  }

  const handleSelectListName = (e) => {
    console.log(e.target.value);
    setSelectListName(e.target.value);
  }

  const handleAddList = async (e) => {
    e.preventDefault();
    let list_name = '';
    if (newListName !== "") {
      list_name = newListName;
    } else {
      if (selectListName !== "") {
        list_name = selectListName;
      } else {
        NotificationManager.error('Please create or select a list to add people');
        return false;
      }
    }

    let selectedId = []
    var checkboxes = document.getElementsByClassName('selectContacts')
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked)
        selectedId.push(checkboxes[i].value);
    }
    if (selectedId.length === 0) {
      NotificationManager.error("Please select people to add in list");
      return false;
    }

    // console.log(selectedId);

    dispatch(progressLoading(40))
    const url = `${API_URL}/api/user/list/create`;
    let data = await fetch(url, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'list_name': list_name,
        'ids': selectedId
      })
    });
    dispatch(progressLoading(100))
    let res = await data.json();
    if (res.status === 'success') {
      setNewListName("");
      NotificationManager.success("List added successfully", "Success!");
    }
  }

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
                <li><a className="dropdown-item select_contact" data-select="50" href="/">Select 50</a></li>
                <li><a className="dropdown-item select_contact" data-select="100" href="/">Select 100</a></li>
                <li><a className="dropdown-item select_contact" data-select="2000" href="/">Select 2000</a></li>
                <li><a className="dropdown-item select_contact" data-select="5000" href="/">Select 5000</a></li>
                <li><a className="dropdown-item select_contact" data-select="10000" href="/">Select 10000</a></li>
                <li><a className="dropdown-item select_contact" data-select="0" href="/">Clear Selection</a></li>
              </ul>
            </span>
            <button type="button" className="btn btn-sm btn-outline-primary text-success bi-tooltip" id="export_csv" data-bs-placement="top" title="Export CSV"><i className="fas fa-download"></i></button>
            <button type="button" className="btn btn-sm btn-outline-primary text-danger bi-tooltip" data-bs-placement="top" title="Delete Contact(s)" onClick={() => { deleteContact() }}><i className="far fa-trash-alt"></i></button>
            <span className="dropdown bi-tooltip" title="Add to list">
              <button className="btn btn-sm btn-outline-primary bi-tooltip" type="button" id="addlistDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="inside">
                <i className="fas fa-plus"></i>
              </button>
              <div className="dropdown-menu shadow p-3" aria-labelledby="addlistDropdown">
                <h5 className="text-center">Add to List</h5>
                <form action="" onSubmit={handleAddList}>
                  <div className="mb-3">
                    <label htmlFor="newListName" className="form-label small">Create New List</label>
                    <input type="text" name="newListName" id="newListName" className="form-control" style={{ "width": "260px" }} placeholder="Provide name for list" maxLength="50" value={newListName} onChange={handlenewListName} />
                  </div>
                  <div className="text-center mb-2">-- or --</div>
                  <div className="mb-3">
                    <label htmlFor="listName" className="form-label small">Select a List</label>
                    <select name="listName" id="listName" onChange={handleSelectListName} className="form-select">
                      <option value="">--</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={disAddBtn && "disabled"}>Save &amp; Add</button>
                </form>
              </div>
            </span>
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" title="Refresh" onClick={() => { window.location.reload() }}><i className="fas fa-sync-alt"></i></button>
          </div>
          <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip me-2" onClick={() => openModal('searchModal')}><i className="fas fa-search"></i> Search</button>

          <div className="ms-3 d-flex mt-1 position-relative">

            <div className="position-absolute text-uppercase" style={{ "top": "-35px", "left": "0" }}>
              <span className="small fw-bold text-primary">Email Confidence Level</span>
            </div>

            <div className="me-3">
              <input type="checkbox" id="high_confidence" className="form-check-input me-1 confidence_level" onChange={() => filterConfidence()} value="High" />
              <label htmlFor="high_confidence" className="form-check-label">Verified</label>
            </div>

            <div className="me-3">
              <input type="checkbox" id="low_confidence" className="form-check-input me-1 confidence_level" onChange={() => filterConfidence()} value="Catchall/Accept_all" />
              <label htmlFor="low_confidence" className="form-check-label">Catch all / Accept all</label>
            </div>

            <div className="me-3">
              <input type="checkbox" id="guessed_confidence" className="form-check-input me-1 confidence_level" onChange={() => filterConfidence()} value="Guessed/Recommended" />
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
                    <input type="checkbox" onClick={(e) => { setSelectAll(e.target.checked) }} className="form-check-input mt-0 me-3" />
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
                <th>Added on</th>
              </tr>
            </thead>
            <tbody id="contactTable">
              {skeletonLoading && <TableSkeleton />}
              {!skeletonLoading &&
                watchList.length !== 0 ?
                <WatchListTableRow TableData={watchList.peoples} showCompanyInfo={getCompanyInfo} selectAll={selectAll} />
                : <NoRecordFound />
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

      <div className="modal" id="searchModal" tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title w-100 text-center">Watchlist Filter</h5>
              <button type="button" className="btn-close" onClick={() => closeModal('searchModal')} aria-label="Close"></button>
            </div>
            <WatchFilter searchWatchList={searchWatchList} closeModal={closeModal} />
          </div>
        </div>
      </div>

      <div className="modal-backdrop" id="modal-backdrop" style={{ "display": "none", "opacity": ".5" }}></div>

    </div >
  )
}

export default Watchlist
