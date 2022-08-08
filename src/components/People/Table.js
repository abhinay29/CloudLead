import React, { useContext, useEffect, useState, useRef } from "react";
import PeopleContext from "../Context/People/PeopleContext";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import TableRow from "./TableRow";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  progressLoading,
  setSequenceList,
  watchList,
  userInfo,
  setPeopleSearchResults
} from "../../states/action-creator";
import TableSkeleton from "../Skeleton/TableSkeleton";
import NoRecordFound from "./NoRecordFound";
import Select from "react-select";
import axios from "axios";
import { OverlayTrigger, Tooltip, Popover } from "react-bootstrap";
import FreezeHistoryTable from "./FreezeHistoryTable";
import SearchStrings from "./SearchStrings";
// import ShowContactModal from "./ShowContactModal";

const API_URL = process.env.REACT_APP_API_URL;

function CreateSearchId(len = 8) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce((a) => a + p[~~(Math.random() * p.length)], "");
}

const Table = (props) => {
  const dispatch = useDispatch();
  const peopleSearchResults = useSelector((state) => state.peopleSearchResults);
  const sequences = useSelector((state) => state.sequences);
  const userState = useSelector((state) => state.setUserData);

  const queryParams = new URLSearchParams(window.location.search);
  const showFilters = queryParams.get("showFilters");

  const context = useContext(PeopleContext);
  const {
    peoples,
    getPeoples,
    totalPeople,
    setTotalPeople,
    setUniqueComp,
    uniqueComp,
    setSkeletonLoading,
    skeletonLoading
  } = context;
  const [selectAll, setSelectAll] = useState(false);
  const [disSaveBtn, setDisSaveBtn] = useState(false);
  const [disAddBtn, setDisAddBtn] = useState(false);
  const { setShowFilter, setShowTable } = props;
  const [directDial, setDirectDial] = useState(0);
  const [backToResultStatus, setBackToResultStatus] = useState(false);

  const pageLimit = useRef(25);
  const pageNumber = useRef(1);

  if (showFilters === "yes") {
    // queryParams.delete("showFilters");
    window.history.replaceState({}, document.title, "/radar/peoples");
    dispatch(progressLoading(30));
    getPeoples([]);
    setTotalPeople(0);
    setUniqueComp(0);
    setShowFilter(true);
    setShowTable(false);
    pageNumber.current = 1;
    setDisSaveBtn(false);
    dispatch(progressLoading(100));
    dispatch(setPeopleSearchResults([]));
    localStorage.removeItem("searchQuery");
  }

  const backToSearch = () => {
    dispatch(progressLoading(30));
    getPeoples([]);
    setTotalPeople(0);
    setUniqueComp(0);
    setShowFilter(true);
    setShowTable(false);
    pageNumber.current = 1;
    setDisSaveBtn(false);
    setSelectAll(false);
    dispatch(progressLoading(100));
    dispatch(setPeopleSearchResults([]));
    let input = document.getElementById("allSelector");
    input.checked = false;
    localStorage.removeItem("searchQuery");
    // props.setResetRole(true);
  };

  const handlePageChange = async (pn) => {
    if (pn !== pageNumber.current) {
      searchPeople(pn);
    }
  };

  const searchPeople = async (pn = 1) => {
    if (!localStorage.getItem("searchQuery")) {
      return false;
    }

    pageNumber.current = pn;
    let query = localStorage.getItem("searchQuery") + `&page=${pn}`;

    if (query.length === 0) {
      return;
    }
    dispatch(progressLoading(30));
    const url = `${API_URL}/api/contacts?${query}&limit=${pageLimit.current}`;
    let data = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    dispatch(progressLoading(50));
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      if (parsedData.totalResults === 0) {
        toast.error("No result found");
        return;
      }
      getPeoples(parsedData);
      pageNumber.current = parsedData.page;
      getCounts(query);
      setSelectAll(false);
      setSkeletonLoading(false);
      dispatch(setPeopleSearchResults(parsedData));
      // let allSelectorCheckbox = document.getElementById("allSelector");
      // allSelectorCheckbox.checked = false;
    }
    dispatch(progressLoading(100));
  };

  const getCounts = async (query) => {
    const url = `${API_URL}/api/contacts/counts?${query}`;
    let data = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      setTotalPeople(parsedData.totalResults);
      setUniqueComp(parsedData.uniqueCompany);
      setDirectDial(parsedData.directDial);
    }
  };

  const [company_info, setCompInfo] = useState({});

  const getCompanyInfo = async (company_id) => {
    if (!company_id) {
      return dispatch(progressLoading(100));
    }
    dispatch(progressLoading(30));
    const data = await fetch(`${API_URL}/api/companies/${company_id}`);
    dispatch(progressLoading(50));
    const CompData = await data.json();
    if (CompData.status === "success") {
      setCompInfo(CompData.comp_data);
      openModal("showCompany");
    }
    dispatch(progressLoading(100));
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

  const saveSearchQuery = async (e) => {
    e.preventDefault();
    setDisSaveBtn(true);
    dispatch(progressLoading(30));
    let input = document.getElementById("saveSearchName");
    const responce = await fetch(`${API_URL}/api/user/savesearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        name: input.value,
        query: JSON.parse(localStorage.getItem("currentQuery"))
      })
    });
    dispatch(progressLoading(50));
    const json = await responce.json();
    if (json.status === "success") {
      toast.success("Search saved successfully");
      input.value = "";
    } else {
      toast.error("Something went wrong please try again later.");
    }
    setDisSaveBtn(false);
    dispatch(progressLoading(100));
  };

  const refreshWatchlist = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/api/contacts/watchlist?page=1&limit=25`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          dispatch(watchList(response.data));
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

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
          // localStorage.removeItem("searchQuery");
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const addToWatchList = async (ids) => {
    const bulkUnlock = await fetch(`${API_URL}/api/contacts/unlockbulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        ids: ids
      })
    });

    if (!bulkUnlock) {
      return false;
    }

    const res = await bulkUnlock.json();

    if (res.status === "success") {
      refreshWatchlist();

      if (res.data.length !== 0) {
        res.data.map((data) => {
          var badge = "";
          if (
            data.email_confidence_level === "valid" ||
            data.email_confidence_level === "Valid"
          ) {
            badge =
              '<span class="badge text-white bg-success small"><i class="fas fa-check-circle me-1" title="Verified"></i> Verified</span>';
          } else if (
            data.email_confidence_level === "catchall" ||
            data.email_confidence_level === "Catchall/Accept_all"
          ) {
            badge =
              '<span class="badge bg-secondary">Guessed / Recommended</span>';
          } else if (
            data.email_confidence_level === "guessed" ||
            data.email_confidence_level === ""
          ) {
            badge = `<span class="badge" style="background: #f57c00"> Guessed / Recommended</span>`;
          }
          var unlockContainer = document.getElementById("unlock_" + data._id);
          unlockContainer.innerHTML = `${data.email} <br>${badge} <span class="ms-2" style="cursor: pointer"><i class="far fa-copy"></i></span>`;
          return true;
        });
      }
      toast.success(`${res.unlocked} contacts added to watchlist`);
      initiateUserInfo();
    } else if (res.status === "exist") {
      toast.warning(res.msg);
    } else if (res.status === "limit_reached") {
      toast.error(res.msg);
    }
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
        return false;
      }
    }

    let selectedId = [];
    var checkboxes = document.getElementsByClassName("selectContacts");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked) {
        if (checkboxes[i].dataset.unlocked === "yes") {
          selectedId.push(checkboxes[i].value);
        }
      }
    }
    if (selectedId.length === 0) {
      toast.error(
        "Please select people already moved to watchlist to add in list"
      );
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

  const getContacts = () => {
    let selectedId = [];
    var checkboxes = document.getElementsByClassName("selectContacts");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked) selectedId.push(checkboxes[i].value);
    }
    if (selectedId.length === 0) {
      toast.error("Please select people to add in watchlist");
      return false;
    }

    addToWatchList(selectedId);
    return true;
  };

  const getSequenceList = async () => {
    const List = await fetch(`${API_URL}/api/user/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });

    if (!List) {
      return false;
    }
    const res = await List.json();

    if (res.status === "success") {
      let sl = [];
      res.lists.map((list) => {
        return sl.push({ label: list, value: list });
      });
      dispatch(setSequenceList(sl));
    }
  };

  const changeViewLimit = (e) => {
    // setLimit(e.target.value);
    pageLimit.current = e.target.value;
    searchPeople();
  };

  // const [freezeDataTable, setFreezeDataTable] = useState({});

  // const handleFreezeDataInput = (e) => {
  //   setFreezeData({ ...freezeData, search_name: e.target.value });
  // };

  const [addToFreezeListTable, setAddToFreezeListTable] = useState({
    searchId: "",
    searchName: "",
    searchString: {},
    emailCount: 0,
    companyCount: 0,
    direactDial: 0,
    emailCheck: false,
    directDialCheck: false
  });
  const [showRenameOption, setShowRenameOption] = useState(false);
  const [showSearchNameInput, setShowSearchNameInput] = useState(false);

  const addToFreezeList = () => {
    setAddToFreezeListTable({
      ...addToFreezeListTable,
      searchId: CreateSearchId(),
      searchString: JSON.parse(localStorage.getItem("currentQuery")),
      emailCount: totalPeople,
      companyCount: uniqueComp,
      direactDial: directDial
    });
    openModal("addToFreezeListModal");
  };

  const handleCheckBox = (e) => {
    setAddToFreezeListTable({
      ...addToFreezeListTable,
      [e.target.name]: e.target.checked
    });
  };

  const submitHandleAddtoFreezeList = async () => {
    let data = await fetch(`${API_URL}/api/user/add-to-freeze-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify(addToFreezeListTable)
    });

    if (!data) {
      return toast.error("Something went wrong, please try again later.");
    }
    const res = await data.json();
    if (res.status === "success") {
      closeModal("addToFreezeListModal");
      setShowSearchNameInput(false);
      setShowRenameOption(false);
      setAddToFreezeListTable({
        ...addToFreezeListTable,
        searchName: ""
      });
      return toast.success(res.msg);
    } else {
      return toast.error(res.error);
    }
  };

  const [freezeHistory, setFreezeHistory] = useState({
    show: false,
    data: [],
    totalCount: 0,
    totalPrice: 0
  });

  const getFreezeHistory = async () => {
    let data = await fetch(`${API_URL}/api/user/get-freeze-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });

    if (!data) {
      return toast.error("Something went wrong, please try again later.");
    }
    const res = await data.json();
    if (res.status === "success") {
      setFreezeHistory({
        ...freezeHistory,
        show: true,
        data: res.data,
        totalCount: res.totalCount,
        totalPrice: res.totalPrice
      });
      return true;
    } else {
      toast.error(res.error);
      return false;
    }
  };
  const showFreezeHistory = () => {
    // localStorage.setItem("carryForward", JSON.stringify({ count: 0, cost: 0 }));
    getFreezeHistory();
    openModal("freezeHistoryModalTable");
  };

  useEffect(() => {
    getSequenceList();
    if (showFilters !== "yes") {
      if (peopleSearchResults.length > 0) {
        if (peopleSearchResults.data.contacts.length === 0) {
          searchPeople(1);
        } else {
          getPeoples(peopleSearchResults);
          // setTotalPeople(peopleSearchResults.totalResults);
          pageNumber.current = peopleSearchResults.page;
          setSelectAll(false);
          // setUniqueComp(peopleSearchResults.uniqueCompany);
          setSkeletonLoading(false);
        }
      } else {
        searchPeople(1);
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    var no_selected_contact = document.getElementById("no_selected_contact");

    if (!selectAll) {
      no_selected_contact.innerHTML = "";
      return false;
    }

    var selectedCheckbox = document.getElementsByClassName("selectContacts");
    no_selected_contact.innerHTML = `${selectedCheckbox.length} contact selected`;
  }, [selectAll]);

  const showAllContacts = async (company_id) => {
    let query = "company_id=" + company_id;
    let oldQuery = localStorage.getItem("searchQuery");
    localStorage.setItem("oldPageNumber", pageNumber.current);
    localStorage.setItem("oldQuery", oldQuery);
    localStorage.removeItem("searchQuery");
    localStorage.setItem("searchQuery", query);
    await searchPeople();
    setBackToResultStatus(true);
  };

  const backToResult = async () => {
    let oldQuery = localStorage.getItem("oldQuery");
    let oldPageNumber = localStorage.getItem("oldPageNumber");
    localStorage.removeItem("oldQuery");
    localStorage.removeItem("searchQuery");
    localStorage.setItem("searchQuery", oldQuery);
    pageNumber.current = oldPageNumber;
    await searchPeople(oldPageNumber);
    setBackToResultStatus(false);
  };

  return (
    <>
      <div>
        <div className="card-body" id="result_body">
          <div className="mb-2 d-flex">
            <div className="me-auto">
              <span className="small fw-bold text-primary">
                CONTACTS (<span>{totalPeople}</span>)
              </span>
              <span className="mx-2">|</span>
              <span className="small fw-bold text-primary">
                UNIQUE COMPANIES (<span>{uniqueComp}</span>)
              </span>
              <span className="mx-2">|</span>
              <span className="small fw-bold text-primary">
                DIRECT DIAL (<span>{directDial}</span>)
              </span>
            </div>
            <div id="no_selected_contact" className="text-primary"></div>
          </div>
          <div className="mb-2">
            {/* <div className="btn-group me-2" role="group" aria-label="Menu"> */}
            <span className="dropdown">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Save Search</Tooltip>}
              >
                <button
                  className="btn btn-sm btn-link me-2"
                  type="button"
                  id="saveSearch"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="far fa-save"></i>
                </button>
              </OverlayTrigger>
              <div
                className="dropdown-menu shadow p-3"
                aria-labelledby="saveSearch"
              >
                <form action="" onSubmit={saveSearchQuery}>
                  <div className="mb-3">
                    <label htmlFor="" className="form-label small">
                      Save Search
                    </label>
                    <input
                      type="text"
                      id="saveSearchName"
                      className="form-control"
                      style={{ width: "200px" }}
                    />
                    <p className="small text-muted">
                      Provide name for this search
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={disSaveBtn && "disabled"}
                  >
                    Save Search
                  </button>
                </form>
              </div>
            </span>
            <span className="dropdown">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Add to List (For sequences)</Tooltip>}
              >
                <button
                  className="btn btn-sm btn-link me-2"
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
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Refresh</Tooltip>}
            >
              <button
                type="button"
                className="btn btn-sm btn-link me-2"
                onClick={() => searchPeople()}
              >
                <i className="fas fa-redo-alt"></i>
              </button>
            </OverlayTrigger>
            {/* </div> */}
            <button
              type="button"
              className="btn btn-sm btn-danger me-2"
              onClick={backToSearch}
            >
              <i className="fas fa-search"></i> Back to Search
            </button>
            {userState.plan_id !== 3 && (
              <>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Bulk Selection</Tooltip>}
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-success me-2"
                    onClick={() => {
                      getContacts();
                    }}
                  >
                    <i className="fas fa-envelope"></i> Get Email
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>
                      The contacts unlocked by you are moved to My watchlist for
                      csv download and email sequences
                    </Tooltip>
                  }
                >
                  <Link
                    to="/radar/people/watchlist"
                    className="btn btn-sm btn-warning me-2"
                  >
                    <i className="fas fa-bookmark"></i> My Watchlist
                  </Link>
                </OverlayTrigger>
              </>
            )}

            {userState.plan_id === 3 && (
              <>
                <span className="dropdown">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip>
                        Add current search filter into freeze list.
                      </Tooltip>
                    }
                  >
                    <button
                      className="btn btn-sm btn-primary px-3"
                      type="button"
                      onClick={() => addToFreezeList()}
                      id="freezeDataBoxBtn"
                    >
                      Add to Freeze List
                    </button>
                  </OverlayTrigger>
                  {/* <div
                    className="dropdown-menu shadow p-3"
                    aria-labelledby="addList"
                  >
                    <h5 className="text-center">Freeze Data</h5>
                    <form action="" onSubmit={sendFreezeData}>
                      <div className="mb-3">
                        <label
                          htmlFor="newListName"
                          className="form-label small"
                        >
                          Search Name <span className="small">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          name="freeze-data-name"
                          id="freeze-data-name"
                          className="form-control"
                          style={{ width: "260px" }}
                          placeholder="Provide name for filter"
                          maxLength="50"
                          value={freezeData.search_name}
                          onChange={handleFreezeDataInput}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={disAddBtn && "disabled"}
                      >
                        Freeze
                      </button>
                    </form>
                  </div> */}
                </span>
                <button
                  className="btn btn-sm btn-success px-3 ms-2"
                  type="button"
                  aria-expanded="false"
                  onClick={() => showFreezeHistory()}
                >
                  My freezes
                </button>
              </>
            )}

            {backToResultStatus && (
              <button
                type="button"
                className="btn btn-sm btn-primary bi-tooltip me-2"
                onClick={() => {
                  backToResult();
                }}
              >
                <i className="fas fa-chevron-left"></i> Back to Result
              </button>
            )}
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
                        id="allSelector"
                        onClick={(e) => {
                          setSelectAll(e.target.checked);
                        }}
                        className="form-check-input mt-0 me-3"
                        disabled={userState.plan_id === 3 ? true : false}
                      />
                      <span>Person's Name</span>
                    </div>
                  </th>
                  {/* <th>Title</th> */}
                  <th>Company</th>
                  {/* <th></th>
                  <th></th> */}
                  <th>Email</th>
                  <th>Direct Dial</th>
                  <th>Boardline Numbers</th>
                  <th>Contact Location</th>
                  <th>Company Location</th>
                </tr>
              </thead>
              <tbody id="contactTable">
                {skeletonLoading ? (
                  <TableSkeleton />
                ) : peoples.data.contacts.length !== 0 ? (
                  <TableRow
                    TableData={peoples.data.contacts}
                    showCompanyInfo={getCompanyInfo}
                    selectAll={selectAll}
                    showAllContacts={showAllContacts}
                    planId={userState.plan_id}
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
                value={pageLimit.current}
                onChange={(e) => changeViewLimit(e)}
                className="form-select form-control-sm"
              >
                <option value="25">25 Contact</option>
                <option
                  value="50"
                  disabled={userState.plan_id === 4 ? true : false}
                >
                  50 Contact
                </option>
              </select>
            </div>
            <nav className="ms-auto d-flex align-items-center">
              <Pagination
                activePage={pageNumber.current}
                itemsCountPerPage={parseInt(pageLimit.current)}
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
                  <p id="ext_description">{company_info.short_description}</p>
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

      <div
        className="modal fade"
        id="freezeHistoryModalTable"
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-xl modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">My Freezes</h5>
              <OverlayTrigger
                trigger={["hover", "focus"]}
                key="bottom"
                placement="bottom"
                className="shadow max-w-440"
                overlay={
                  <Popover className="shadow">
                    <Popover.Body>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Upto contacts</th>
                            <th>INR price Per contact</th>
                            <th>Total price INR</th>
                          </tr>
                        </thead>
                        <tbody className="text-end">
                          <tr>
                            <td>2000</td>
                            <td>2.50</td>
                            <td>5000</td>
                          </tr>
                          <tr>
                            <td>2001 - 5000</td>
                            <td>1.75</td>
                            <td>5250</td>
                          </tr>
                          <tr>
                            <td>5001 - 10000</td>
                            <td>1.00</td>
                            <td>5000</td>
                          </tr>
                          <tr>
                            <td>10001 - 20000</td>
                            <td>0.70</td>
                            <td>7000</td>
                          </tr>
                          <tr>
                            <td>20001 - 40000</td>
                            <td>0.50</td>
                            <td>10000</td>
                          </tr>
                        </tbody>
                      </table>
                    </Popover.Body>
                  </Popover>
                }
              >
                <button className="btn btn-link">Pricing</button>
              </OverlayTrigger>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={() => closeModal("freezeHistoryModalTable")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button
                    className="nav-link active"
                    id="nav-profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#freezes"
                    type="button"
                    role="tab"
                    aria-controls="freezes"
                    aria-selected="false"
                  >
                    Freezes
                  </button>
                  <button
                    className="nav-link"
                    id="nav-profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#freezeHistory"
                    type="button"
                    role="tab"
                    aria-controls="freezeHistory"
                    aria-selected="false"
                  >
                    Freeze History
                  </button>
                </div>
              </nav>
              <div className="tab-content mt-3" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="freezes"
                  role="tabpanel"
                  aria-labelledby="freezes-tab"
                >
                  {freezeHistory.data ? (
                    <FreezeHistoryTable
                      freezeHistory={freezeHistory}
                      backToSearch={backToSearch}
                      closeHistoryModal={() =>
                        closeModal("freezeHistoryModalTable")
                      }
                      getFreezeHistory={getFreezeHistory}
                    />
                  ) : (
                    <div className="p-5 text-center">Loading...</div>
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="freezeHistory"
                  role="tabpanel"
                  aria-labelledby="freezeHistory-tab"
                >
                  <div className="text-center p-4">
                    <h5>No data found!!!</h5>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  closeModal("freezeHistoryModalTable");
                }}
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="addToFreezeListModal"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-scrollable" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">Add to Freeze List</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={() => {
                  closeModal("addToFreezeListModal");
                  setShowRenameOption(false);
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table">
                <thead>
                  <tr>
                    <td>
                      Search ID: <b>{addToFreezeListTable.searchId}</b>
                    </td>
                    <td className="text-end">Count</td>
                    <td className="text-center">Select</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p className="mb-0 text-primary">Search Details :-</p>
                      <SearchStrings fh={addToFreezeListTable.searchString} />
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td className="text-end">
                      {addToFreezeListTable.emailCount}
                    </td>
                    <td style={{ width: "100px" }} className="text-center">
                      <input
                        type="checkbox"
                        name="emailCheck"
                        onChange={handleCheckBox}
                        value=""
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Company</td>
                    <td className="text-end">
                      {addToFreezeListTable.companyCount}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Direct Dial</td>
                    <td className="text-end">
                      {addToFreezeListTable.direactDial}
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="directDialCheck"
                        onChange={handleCheckBox}
                        value=""
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              {showRenameOption ? (
                <>
                  {showSearchNameInput ? (
                    <>
                      <input
                        type="text"
                        name="searchName"
                        className="form-control"
                        value={addToFreezeListTable.searchName}
                        onChange={(e) =>
                          setAddToFreezeListTable({
                            ...addToFreezeListTable,
                            searchName: e.target.value
                          })
                        }
                        placeholder="Enter name for this search"
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={submitHandleAddtoFreezeList}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <p>Do you wish to save/rename this search?</p>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setShowSearchNameInput(true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                        onClick={submitHandleAddtoFreezeList}
                      >
                        No
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      setShowRenameOption(true);
                    }}
                    disabled={addToFreezeListTable.emailCheck ? false : true}
                  >
                    Add to Freeze List
                  </button>
                </>
              )}
              <br />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  closeModal("addToFreezeListModal");
                  setShowRenameOption(false);
                  setShowSearchNameInput(false);
                }}
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="modal" id="showContactModal" tabIndex="-1">
        <ShowContactModal />
      </div> */}

      <div
        className="modal-backdrop"
        id="modal-backdrop"
        style={{ display: "none", opacity: ".5" }}
      ></div>
    </>
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

export default Table;
