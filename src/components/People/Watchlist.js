import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import WatchListTableRow from "./WatchListTableRow";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setSequenceList,
  progressLoading,
  userInfo
} from "../../states/action-creator";
import WatchFilter from "./WatchlistFilter";
import TableSkeleton from "../Skeleton/TableSkeleton";
import NoRecordFound from "./NoRecordFound";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Watchlist = () => {
  const [watchList, setWatchList] = useState([]);
  const initialWatchlist = useSelector((state) => state.initialWatchlist);
  // setWatchList(initialWatchlist);
  const sequences = useSelector((state) => state.sequences);

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [people, setPeople] = useState(0);
  const [selectAll, setSelectAll] = useState({ select: false, len: 100 });
  // eslint-disable-next-line
  const [uniqueComp, setUniqueComp] = useState(0);
  const [disAddBtn, setDisAddBtn] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(false);
  const [limit, setLimit] = useState(25);
  const [showBacktoWatchlist, setShowBacktoWatchlist] = useState(false);

  const initiateUserInfo = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/api/auth/getuser`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          dispatch(userInfo(response.data.userdata));
          localStorage.removeItem("searchQuery");
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== page) {
      dispatch(progressLoading(50));
      getWatchlist(pageNumber);
      dispatch(progressLoading(100));
    }
  };

  const searchWatchList = (query, pageNumber = 1) => {
    closeModal("searchModal");
    getWatchlist(pageNumber, query);
  };

  const getWatchlist = async (pageNumber = 1, query = "") => {
    setPage(pageNumber);
    dispatch(progressLoading(30));
    const url = `${API_URL}/api/contacts/watchlist?page=${pageNumber}${query}&limit=${limit}`;
    let data = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    dispatch(progressLoading(60));
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      if (parsedData.totalResults !== 0) {
        setPeople(parsedData.totalResults);
        setWatchList(parsedData);
        setUniqueComp(parsedData.totalCompanies);
      } else {
        setPeople(0);
        setWatchList([]);
      }
    }
    dispatch(progressLoading(100));
    setSkeletonLoading(false);
  };

  useEffect(() => {
    // getWatchlist();
    if (initialWatchlist) {
      if (initialWatchlist.totalResults === 0) {
        getWatchlist();
      } else {
        setPeople(initialWatchlist.totalResults);
        setWatchList(initialWatchlist);
      }
    } else {
      getWatchlist();
    }
    // eslint-disable-next-line
  }, []);

  const filterConfidence = () => {
    let confidence_checkbox =
      document.getElementsByClassName("confidence_level");
    let query = "";
    for (var i = 0, n = confidence_checkbox.length; i < n; i++) {
      if (confidence_checkbox[i].checked) {
        query += `&email_confidence_level=${confidence_checkbox[i].value}`;
      }
    }
    getWatchlist(1, query);
  };

  const [company_info, setCompInfo] = useState({});

  const getCompanyInfo = async (comp_name) => {
    dispatch(progressLoading(30));

    const data = await fetch(`${API_URL}/api/companies/${comp_name}`);

    dispatch(progressLoading(60));

    const CompData = await data.json();

    dispatch(progressLoading(100));

    if (CompData.status === "success") {
      setCompInfo(CompData.comp_data);
      openModal("showCompany");
    }
  };

  const openModal = (modalId) => {
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    var modal = document.getElementById(modalId);
    modal.classList.add("show");
    modal.style.display = "block";
    let modalBackdrop = document.getElementById("modal-backdrop");
    modalBackdrop.style.display = "block";
  };

  const closeModal = (modalId) => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "visible";
    document.body.style.padding = "0";
    var modal = document.getElementById(modalId);
    modal.classList.remove("show");
    modal.style.display = "none";
    let modalBackdrop = document.getElementById("modal-backdrop");
    modalBackdrop.style.display = "none";
  };

  const deleteContact = async () => {
    let selectedId = [];
    var checkboxes = document.getElementsByClassName("selectContacts");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked) selectedId.push(checkboxes[i].value);
    }
    if (selectedId.length === 0) {
      toast.error("Please select people to delete from watchlist");
      return false;
    }
    dispatch(progressLoading(30));
    const bulkDelete = await fetch(`${API_URL}/api/contacts/deletewatchlist`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        ids: selectedId
      })
    });
    if (!bulkDelete) {
      dispatch(progressLoading(100));
      return false;
    }
    dispatch(progressLoading(60));
    const res = await bulkDelete.json();

    if (res.status === "success") {
      getWatchlist();
      toast.success(`${res.deletedCount} contacts deleted from watchlist`);
    } else {
      toast.error("Something went wrong, please try again later.");
    }
    dispatch(progressLoading(100));
    return true;
  };

  const [sequenceListName, setSequenceListName] = useState("");

  const handleSelectChange = (inVal) => {
    setSequenceListName(inVal);
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    setDisAddBtn(true);
    let newListName = document.getElementById("newListName");
    let list_name = "";
    if (newListName.value) {
      list_name = newListName.value;
      var check_List = sequences.filter((obj) => obj.label === list_name);
      if (check_List.length === 0 || sequences.length === 0) {
        let sl = sequences;
        sl.push({ label: list_name, value: list_name });
        dispatch(setSequenceList(sl));
      }
    } else {
      if (sequenceListName) {
        list_name = sequenceListName.value;
      } else {
        toast.error("Please create or select a list to add people");
        setDisAddBtn(true);
        return false;
      }
    }

    let selectedId = [];
    var checkboxes = document.getElementsByClassName("selectContacts");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked) {
        selectedId.push(checkboxes[i].value);
      }
    }
    if (selectedId.length === 0) {
      toast.error("Please select people to add in list");
      setDisAddBtn(true);
      return false;
    }
    setDisAddBtn(false);
    addSequenceList(list_name, selectedId);
  };

  const addSequenceList = async (name, ids) => {
    const addList = await fetch(`${API_URL}/api/user/list/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        ids: ids,
        name: name
      })
    });

    if (!addList) return toast.error("Something went wrong.");

    const res = await addList.json();

    if (res.status === "success") {
      toast.success(res.message);
    } else if (res.status === "error") {
      toast.error(res.error);
    } else {
      toast.error("Something went wrong.");
    }
  };

  const handleExportSelectContact = async () => {
    let selectedId = [];
    var checkboxes = document.getElementsByClassName("selectContacts");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked) selectedId.push(checkboxes[i].value);
    }
    if (selectedId.length === 0) {
      toast.error("Please select record rows to download.");
      return false;
    }
    dispatch(progressLoading(30));
    const exportCsv = await fetch(`${API_URL}/api/contacts/watchlist/export`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ids: selectedId,
        email: localStorage.getItem("uemail")
      })
    });

    if (!exportCsv) {
      dispatch(progressLoading(100));
      return false;
    }
    dispatch(progressLoading(60));
    const res = await exportCsv.json();
    if (res.status === "success") {
      toast.success("Contact exported successfully, please check your inbox");
      initiateUserInfo();
    } else {
      toast.error("Something went wrong, please try again later.");
    }
    dispatch(progressLoading(100));
    return true;
  };

  const changeViewLimit = (e) => {
    setLimit(e.target.value);
    getWatchlist();
  };

  useEffect(() => {
    var no_selected_contact = document.getElementById("no_selected_contact");

    if (!selectAll.select) {
      no_selected_contact.innerHTML = "";
      return false;
    }

    var selectedCheckbox = document.getElementsByClassName("selectContacts");
    let length = 0;
    for (var i = 0, n = selectedCheckbox.length; i < n; i++) {
      if (selectedCheckbox[i].checked === true) {
        length++;
      }
    }
    no_selected_contact.innerHTML = `${length} contact selected`;
  }, [selectAll]);

  return (
    <div>
      <div className="card-body" id="result_body">
        <div className="mb-2 d-flex">
          <div className="me-auto">
            <span className="small fw-bold text-primary me-2">
              CONTACTS (<span>{people}</span>)
            </span>
            <span className="small fw-bold text-primary">
              UNIQUE COMPANIES (<span>{uniqueComp}</span>)
            </span>
          </div>
          <div id="no_selected_contact" className="text-primary"></div>
        </div>
        <div className="mb-2 d-flex">
          <div className="btn-group me-2" role="group" aria-label="Menu">
            <span
              className="dropdown bi-tooltip"
              data-bs-placement="top"
              title="Select"
            >
              <button
                className="btn btn-sm btn-outline-primary dropdown-toggle"
                type="button"
                id="selectDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <input type="checkbox" className="form-check-input" />
              </button>
              <ul className="dropdown-menu" aria-labelledby="selectDropdown">
                <li>
                  <a
                    className="dropdown-item select_contact"
                    data-select="25"
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectAll({ select: true, len: 25 });
                    }}
                  >
                    Select 25
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item select_contact"
                    data-select="50"
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectAll({ select: true, len: 50 });
                    }}
                  >
                    Select 50
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item select_contact"
                    data-select="100"
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectAll({ select: true, len: 100 });
                    }}
                  >
                    Select 100
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item select_contact"
                    data-select="500"
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectAll({ select: true, len: 500 });
                    }}
                  >
                    Select 500
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item select_contact"
                    data-select="1000"
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectAll({ select: true, len: 1000 });
                    }}
                  >
                    Select 1000
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item select_contact"
                    data-select="2000"
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectAll({ select: true, len: 2000 });
                    }}
                  >
                    Select 2000
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item select_contact"
                    data-select="0"
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectAll({ select: false, len: 2000 });
                    }}
                  >
                    Clear Selection
                  </a>
                </li>
              </ul>
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary text-success bi-tooltip"
              id="export_csv"
              data-bs-placement="top"
              title="Export CSV"
              onClick={handleExportSelectContact}
            >
              <i className="fas fa-download"></i>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary text-danger bi-tooltip"
              data-bs-placement="top"
              title="Delete Contact(s)"
              onClick={() => {
                deleteContact();
              }}
            >
              <i className="far fa-trash-alt"></i>
            </button>
            <span className="dropdown">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Add to List</Tooltip>}
              >
                <button
                  className="btn btn-sm btn-outline-primary"
                  type="button"
                  data-bs-auto-close="false"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </OverlayTrigger>
              <div
                className="dropdown-menu shadow p-3"
                aria-labelledby="addList"
              >
                <h5 className="text-center">Add to List</h5>
                <form action="" onSubmit={handleAddList}>
                  <div className="mb-3">
                    <label htmlFor="newListName" className="form-label small">
                      Create New List
                    </label>
                    <input
                      type="text"
                      name="newListName"
                      id="newListName"
                      className="form-control"
                      style={{ width: "260px" }}
                      placeholder="Provide name for list"
                      maxLength="50"
                    />
                  </div>
                  <div className="text-center mb-2">-- or --</div>
                  <div className="mb-3">
                    {sequences && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={sequenceListName}
                        name="listName"
                        onChange={handleSelectChange}
                        options={sequences}
                        className="basic-multi-select"
                        placeholder="Select List"
                      />
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={disAddBtn && "disabled"}
                  >
                    Save &amp; Add
                  </button>
                </form>
              </div>
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary bi-tooltip"
              title="Refresh"
              onClick={() => {
                getWatchlist();
              }}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary bi-tooltip me-2"
            onClick={() => openModal("searchModal")}
          >
            <i className="fas fa-filter"></i> Filter Watchlist
          </button>
          <Link
            to="/radar/people"
            className="btn btn-sm btn-primary bi-tooltip me-2"
          >
            <i className="fas fa-chevron-left"></i> Back to Result
          </Link>
          {showBacktoWatchlist && (
            <button
              type="button"
              className="btn btn-sm btn-primary bi-tooltip me-2"
              title="Refresh"
              onClick={() => {
                getWatchlist();
                setShowBacktoWatchlist(false);
              }}
            >
              <i className="fas fa-chevron-left"></i> Back to Watchlist
            </button>
          )}
          <Link
            to="/radar/people?showFilters=yes"
            className="btn btn-sm btn-primary bi-tooltip me-2"
          >
            <i className="fas fa-search"></i> Back to Search
          </Link>

          <div className="ms-3 d-flex mt-1 position-relative">
            <div
              className="position-absolute text-uppercase"
              style={{ top: "-35px", left: "0" }}
            >
              <span className="small fw-bold text-primary">
                Email Confidence Level
              </span>
            </div>

            <div className="me-3">
              <input
                type="checkbox"
                id="high_confidence"
                className="form-check-input me-1 confidence_level"
                onChange={() => filterConfidence()}
                value="Valid"
              />
              <label htmlFor="high_confidence" className="form-check-label">
                Verified
              </label>
            </div>

            <div className="me-3">
              <input
                type="checkbox"
                id="low_confidence"
                className="form-check-input me-1 confidence_level"
                onChange={() => filterConfidence()}
                value="catchall"
              />
              <label htmlFor="low_confidence" className="form-check-label">
                Guessed / Recommended
              </label>
            </div>

            {/* <div className="me-3">
              <input
                type="checkbox"
                id="guessed_confidence"
                className="form-check-input me-1 confidence_level"
                onChange={() => filterConfidence()}
                value="guessed"
              />
              <label
                htmlFor="guessed_confidence"
                className="form-check-label"
              ></label>
            </div> */}
          </div>
        </div>
        <div
          className="table-responsive border"
          style={{ height: "calc(100vh - 215px)", overflowY: "scroll" }}
        >
          <table
            className="table table-borderless tableFixHead mb-0"
            id="peopleTable"
          >
            <thead>
              <tr>
                <th>
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="selectAllCheckbox"
                      onChange={(e) => {
                        setSelectAll({ select: e.target.checked, len: limit });
                      }}
                      className="form-check-input mt-0 me-3"
                    />
                    <span>Person's Name</span>
                  </div>
                </th>
                {/* <th>Title</th> */}
                <th>Company</th>
                {/* <th>Industry</th>
                <th>Head Count</th> */}
                <th>Email</th>
                <th>Direct Dial</th>
                <th>Boardline Numbers</th>
                <th>Contact Location</th>
                <th>Company Location</th>
                <th>Added on</th>
              </tr>
            </thead>
            <tbody id="contactTable">
              {skeletonLoading && <TableSkeleton />}
              {!skeletonLoading && people !== 0 ? (
                <WatchListTableRow
                  TableData={watchList.peoples}
                  showCompanyInfo={getCompanyInfo}
                  selectAll={selectAll}
                />
              ) : (
                <NoRecordFound />
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 d-flex align-items-center">
          <div>
            <select
              name="no_of_contact"
              id="no_of_contact"
              value={limit}
              onChange={(e) => changeViewLimit(e)}
              className="form-select form-control-sm"
            >
              <option value="25">25 Contact</option>
              <option value="50">50 Contact</option>
            </select>
          </div>
          <nav className="ms-auto d-flex align-items-center">
            <Pagination
              activePage={page}
              itemsCountPerPage={parseInt(limit)}
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
        <div
          className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title" id="mod_comp_name">
                {company_info.organization_name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={() => closeModal("showCompany")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" id="ext_body">
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <p className="fw-bold mb-1">Website</p>
                  <p className="text-break">
                    {websiteCorrection(company_info.website_link)}
                  </p>
                  <p className="fw-bold mb-1">Linkedin</p>
                  <p className="text-break">
                    {linkedCorrection(company_info.org_linkedin_url)}
                  </p>
                  <p className="fw-bold mb-1">Founded</p>
                  <p id="ext_founded">{company_info.founded_year}</p>
                </div>
                <div className="col-md-6 col-lg-6">
                  <p className="fw-bold mb-1">Industry</p>
                  <p id="ext_industry" className="text-capitalize">
                    {company_info.industry}
                  </p>
                  <p className="fw-bold mb-1">Size</p>
                  <p id="ext_size">{company_info.size_range}</p>
                  <p className="fw-bold mb-1">Revenue</p>
                  <p id="ext_revenue">{company_info.annual_revenue}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-12">
                  <p className="fw-bold mb-1">Company Description</p>
                  <p id="ext_description">{company_info.company_description}</p>
                  <p className="fw-bold mb-1">Location</p>
                  <p id="ext_location">
                    {company_info.org_city},{" "}
                    <strong>{company_info.org_country}</strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  closeModal("showCompany");
                }}
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="searchModal" tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title w-100 text-center">
                Watchlist Filter
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("searchModal")}
                aria-label="Close"
              ></button>
            </div>
            <WatchFilter
              searchWatchList={searchWatchList}
              setShowBacktoWatchlist={setShowBacktoWatchlist}
              closeModal={closeModal}
            />
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop"
        id="modal-backdrop"
        style={{ display: "none", opacity: ".5" }}
      ></div>
    </div>
  );
};

function websiteCorrection(link) {
  var c;
  if (link) {
    c = link.replace(/http\/\//g, "");
    if (!c.match(/^[a-zA-Z]+:\/\//)) {
      c = "http://" + c;
    }
    return (
      <a href={c} rel="noreferrer" id="ext_website" target="_blank">
        {c}
      </a>
    );
  }
  return "";
}

function linkedCorrection(link) {
  var c;
  if (link) {
    c = link.replace(/http\/\//g, "");
    if (!c.match(/^[a-zA-Z]+:\/\//)) {
      c = "http://" + c;
    }
    if (c.match(/linkedin\.com/)) {
      return (
        <a href={c} rel="noreferrer" id="ext_linkedin_link" target="_blank">
          {c}
        </a>
      );
    }
  }
  return "";
}

export default Watchlist;
