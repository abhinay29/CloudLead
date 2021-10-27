import React, { useContext, useEffect, useState } from 'react'
import PeopleContext from '../Context/People/PeopleContext';
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import TableRow from './TableRow'
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { progressLoading } from '../../states/action-creator';
import TableSkeleton from '../Skeleton/TableSkeleton';

const API_URL = process.env.REACT_APP_API_URL;

const Table = (props) => {

  const dispatch = useDispatch()

  const context = useContext(PeopleContext);
  const { peoples, getPeoples, totalPeople, setTotalPeople, setUniqueComp, uniqueComp, setSkeletonLoading, skeletonLoading } = context;
  const [page, setPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [disSaveBtn, setDisSaveBtn] = useState(false);
  const [disAddBtn, setDisAddBtn] = useState(false);
  const { setShowFilter, setShowTable } = props
  const [limit, setLimit] = useState(50);

  const backToSearch = () => {
    dispatch(progressLoading(30))
    getPeoples([]);
    setTotalPeople(0)
    setShowFilter(true)
    setShowTable(false)
    setPage(1);
    setDisSaveBtn(false)
    setSelectAll(false)
    dispatch(progressLoading(100))
    let input = document.getElementById('allSelector');
    input.checked = false;
    localStorage.removeItem('searchQuery');
    // props.setResetRole(true);
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== page)
      searchPeople(pageNumber)
  }

  const searchPeople = async (pageNumber = 1) => {

    if (!localStorage.getItem('searchQuery')) {
      return false;
    }

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
        NotificationManager.error('No result found');
        return
      }
      getPeoples(parsedData)
      setTotalPeople(parsedData.totalResults)
      setSelectAll(false)
      setUniqueComp(parsedData.uniqueCompany)
      setSkeletonLoading(false);
    }
    dispatch(progressLoading(100))
  }

  const [company_info, setCompInfo] = useState({})

  const getCompanyInfo = async (comp_name) => {
    dispatch(progressLoading(30))
    const data = await fetch(`${API_URL}/api/companies/${comp_name}`)
    dispatch(progressLoading(50))
    const CompData = await data.json()
    if (CompData.status === 'success') {
      setCompInfo(CompData.comp_data)
      openModal('showCompany');
    }
    dispatch(progressLoading(100))

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

  const saveSearchQuery = async (e) => {
    e.preventDefault();
    setDisSaveBtn(true);
    dispatch(progressLoading(30))
    let input = document.getElementById('saveSearchName');
    const responce = await fetch(`${API_URL}/api/user/savesearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: input.value,
        query: JSON.parse(localStorage.getItem('currentQuery'))
      })
    })
    dispatch(progressLoading(50))
    const json = await responce.json()
    if (json.status === 'success') {
      NotificationManager.success('Search saved successfully');
      input.value = '';
    } else {
      NotificationManager.error("Something went wrong please try again later.");
    }
    setDisSaveBtn(false);
    dispatch(progressLoading(100))
  }

  const addToWatchList = async (ids) => {
    const bulkUnlock = await fetch(`${API_URL}/api/contacts/unlockbulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        ids: ids
      })
    })
    if (!bulkUnlock) { return false }

    const res = await bulkUnlock.json();

    if (res.status === 'success') {
      if (res.data.length !== 0) {
        res.data.map(data => {
          var badge = '';
          if (data.primary_mai_confidence === 'High' || data.primary_mai_confidence === 'Verified') {
            badge = '<span class="badge text-white bg-success small"><i class="fas fa-check-circle me-1" title="Verified"></i> Verified</span>';
          } else if (data.primary_mai_confidence === 'Low' || data.primary_mai_confidence === 'Catchall/Accept_all') {
            badge = '<span class="badge bg-secondary">Catch all / Accept all</span>';
          } else if (data.primary_mai_confidence === 'Guessed' || data.primary_mai_confidence === 'Guessed/Recommended') {
            badge = `<span class="badge" style="background: #f57c00"> Guessed / Recommended</span>`;
          }
          var unlockContainer = document.getElementById('unlock_' + data._id);
          unlockContainer.innerHTML = `${data.primary_email} <br>${badge} <span class="ms-2" style="cursor: pointer"><i class="far fa-copy"></i></span>`;
          return true;
        })
      }
      NotificationManager.success(`${res.unlocked} contacts added to watchlist`, "Success!", 3000);
    } else if (res.status === 'exist') {
      NotificationManager.warning(res.msg);
    } else if (res.status === 'limit_reached') {
      NotificationManager.error(res.msg);
    }
  }

  const handleAddList = async (e) => {
    e.preventDefault();
    let newListName = document.getElementById('newListName');
    let listName = document.getElementById('listName');
    let list_name = '';
    if (newListName.value) {
      list_name = newListName.value;
    } else {
      if (listName.value) {
        list_name = listName.value;
      } else {
        NotificationManager.error('Please create or select a list to add people');
        return false;
      }
    }

    // console.log(list_name)

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
  }

  const getContacts = () => {
    let selectedId = []
    var checkboxes = document.getElementsByClassName('selectContacts')
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked)
        selectedId.push(checkboxes[i].value);
    }
    if (selectedId.length === 0) {
      NotificationManager.error("Please select people to add in watchlist");
      return false;
    }

    addToWatchList(selectedId)
    return true;
  }

  const changeViewLimit = (e) => {
    setLimit(e.target.value)
  }

  useEffect(() => {
    searchPeople()
  }, [limit])

  useEffect(() => {
    var no_selected_contact = document.getElementById('no_selected_contact');

    if (!selectAll) { no_selected_contact.innerHTML = ""; return false }

    var selectedCheckbox = document.getElementsByClassName('selectContacts')
    no_selected_contact.innerHTML = `${selectedCheckbox.length} contact selected`;

  }, [selectAll])

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
                <li><a className="dropdown-item select_contact" data-select="50" href="/" onClick={(e) => { e.preventDefault(); setSelectAll(true) }}>Select 50</a></li>
                <li><a className="dropdown-item select_contact" data-select="100" href="/" onClick={(e) => { e.preventDefault(); setSelectAll(true) }}>Select 100</a></li>
                <li><a className="dropdown-item select_contact" data-select="0" href="/" onClick={(e) => { e.preventDefault(); setSelectAll(false) }}>Clear Selection</a></li>
              </ul>
            </span>
            <span className="dropdown bi-tooltip">
              <button className="btn btn-sm btn-outline-primary bi-tooltip" type="button" id="saveSearch" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="far fa-save"></i>
              </button>
              <div className="dropdown-menu shadow p-3" aria-labelledby="saveSearch">
                <form action="" onSubmit={saveSearchQuery}>
                  <div className="mb-3">
                    <label htmlFor="" className="form-label small">Save Search</label>
                    <input type="text" id="saveSearchName" className="form-control" style={{ "width": "200px" }} />
                    <p className="small text-muted">Provide name for this search</p>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={disSaveBtn && "disabled"}>Save Search</button>
                </form>
              </div>
            </span>
            <span className="dropdown bi-tooltip" title="Add to list">
              <button className="btn btn-sm btn-outline-primary bi-tooltip" type="button" id="saveSearch" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-plus"></i>
              </button>
              <div className="dropdown-menu shadow p-3" aria-labelledby="addList">
                <h5 className="text-center">Add to List</h5>
                <form action="" onSubmit={handleAddList}>
                  <div className="mb-3">
                    <label htmlFor="newListName" className="form-label small">Create New List</label>
                    <input type="text" name="newListName" id="newListName" className="form-control" style={{ "width": "260px" }} placeholder="Provide name for list" maxLength="50" />
                  </div>
                  <div className="text-center mb-2">-- or --</div>
                  <div className="mb-3">
                    <label htmlFor="listName" className="form-label small">Select a List</label>
                    <select name="listName" id="listName" className="form-select">
                      <option value="">--</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={disAddBtn && "disabled"}>Save &amp; Add</button>
                </form>
              </div>
            </span>
            <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip" onClick={() => window.location.reload()} title="Refresh"><i className="fas fa-sync-alt"></i></button>
          </div>
          <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip me-2" title="Back to Search" onClick={backToSearch}><i className="fas fa-search"></i> Back to Search</button>
          <button type="button" className="btn btn-sm btn-outline-primary bi-tooltip me-2" onClick={() => { getContacts() }} title="Get Contacts"><i className="fas fa-envelope"></i> Get Contacts</button>
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
              {skeletonLoading && <TableSkeleton />}
              {!skeletonLoading &&
                peoples.length !== 0 ?
                <TableRow TableData={peoples.data.contacts} showCompanyInfo={getCompanyInfo} selectAll={selectAll} />
                : <tr><td colSpan="11" className="text-center py-2"><h5 className="mb-0">No record found</h5></td></tr>
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
              itemsCountPerPage={parseInt(limit)}
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
