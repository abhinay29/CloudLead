import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { progressLoading } from "../../states/action-creator";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ContactTableRow from "../People/TableRow";
import SettingsEmailSetup from "./SettingsEmailSetup";
import Select from "react-select";

const API_URL = process.env.REACT_APP_API_URL;

function Sequences() {
  const dispatch = useDispatch();

  const [sequence, setSequence] = useState([]);
  const [peoples, getPeoples] = useState([]);
  const [listName, setListName] = useState("");
  const [totalContacts, setTotalContacts] = useState(0);
  const [templateList, setTemplateList] = useState([]);
  const [sendListName, setSendListName] = useState("");
  const [campaignForm, setCampaignForm] = useState({
    listId: null,
    templateId: null
  });
  const [showSchedule, setShowSchedule] = useState(false);
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [showListOption, setShowListOption] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");

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

  const [sequenceName, setSequenceName] = useState("");
  const [seqFeq, setSeqFeq] = useState("");
  const [seqDays, setSeqDays] = useState({
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0
  });
  const [seqStartDateTime, setSeqStartDateTime] = useState("");

  const handleDays = (e) => {
    if (e.target.checked) {
      setSeqDays({ ...seqDays, [e.target.value]: 1 });
    } else {
      setSeqDays({ ...seqDays, [e.target.value]: 0 });
    }
  };

  const createSequence = async (e) => {
    e.preventDefault();

    let checkImmediate = document.getElementById("immediate");
    let checkScheduled = document.getElementById("scheduled");

    if (!sequenceName) {
      return toast.error("Please enter name for sequence");
    }

    if (!checkImmediate.checked && !checkScheduled.checked) {
      return toast.error("Please select Immediate/Schedule");
    }

    dispatch(progressLoading(30));
    const addList = await fetch(`${API_URL}/api/user/sequence/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        name: sequenceName,
        frequency: seqFeq,
        days: seqDays,
        start_datetime: seqStartDateTime
      })
    });

    if (!addList)
      return toast.error("Something went wrong, please try again later");

    const res = await addList.json();

    if (res.status === "success") {
      closeModal("createSequenceModal");
      setSequenceName("");
      toast.success(res.message);
    } else if (res.status === "error") {
      toast.error(res.error);
    } else {
      toast.error("Something went wrong.");
    }
    dispatch(progressLoading(100));
    getSequence();
  };

  const getLists = async (seqName = "") => {
    dispatch(progressLoading(30));
    const url = `${API_URL}/api/user/list/detailed?s=${seqName}`;
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
      var tempList = await parsedData.lists.map((l) => {
        return { label: `${l.name} (${l.rcptcount})`, value: l.id };
      });
      setLists(tempList);
    }
    dispatch(progressLoading(100));
  };

  const viewList = async (id) => {
    dispatch(progressLoading(30));
    let url = `${API_URL}/api/user/list/view/${id}`;
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
      if (parsedData.list.length === 0) {
        toast.error("No result found");
        return;
      }
      setListName(parsedData.list_name);
      getPeoples(parsedData.list);
      setTotalContacts(parsedData.list.length);
      openModal("showContactModal");
    }
    dispatch(progressLoading(100));
  };

  const getSequence = async (seqName = "") => {
    dispatch(progressLoading(30));
    const url = `${API_URL}/api/user/sequence?s=${seqName}`;
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
      setSequence(parsedData.sequenceList);
    }
    dispatch(progressLoading(100));
  };

  const deleteList = async (id) => {
    if (!window.confirm("Do you really want to delete this list?")) {
      return;
    }
    dispatch(progressLoading(30));
    let url = `${API_URL}/api/user/list/${id}`;
    let data = await fetch(url, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    dispatch(progressLoading(50));
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      toast.success("List Deleted Successfully");
      getSequence();
    }
    dispatch(progressLoading(100));
  };

  const getTemplateList = async () => {
    let url = `${API_URL}/api/user/templates`;
    let data = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      setTemplateList(parsedData.template_list);
    }
  };

  const sendEmailCampaign = async (e) => {
    e.preventDefault();

    if (!campaignForm.templateId) {
      return toast.error("Please select a template to send email to list");
    }

    let url = `${API_URL}/api/user/sendemail`;
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        listId: campaignForm.listId,
        template_id: campaignForm.templateId
      })
    });
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      toast.success(parsedData.message);
      closeModal("sendEmailModal");
    } else {
      toast.error(parsedData.error);
    }
  };

  const sendEmail = async (id, name) => {
    setSendListName(name);
    getTemplateList();
    setCampaignForm({ ...campaignForm, listId: id });
    openModal("sendEmailModal");
  };

  const handleInputChange = (e) => {
    setCampaignForm({ ...campaignForm, templateId: e.target.value });
  };

  const handleListOption = (e) => {
    if (e.target.value === "selectList") {
      if (e.target.checked) {
        setShowListOption(true);
      } else {
        setShowListOption(false);
      }
      setShowUploadOption(false);
    }

    if (e.target.value === "importCsv") {
      if (e.target.checked) {
        setShowUploadOption(true);
      } else {
        setShowUploadOption(false);
      }
      setShowListOption(false);
    }
  };

  const handleSequenceSearch = async (e) => {
    setTimeout(() => {
      // console.log(e.target.value);
      getSequence(e.target.value);
    }, 800);
  };

  useEffect(() => {
    getSequence();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="fullHeightWithNavBar p-4">
        <div className="card">
          <div className="card-body">
            <div className="cardTitle mb-4 d-flex justify-content-between align-items-center">
              <h5>Sequences</h5>
              <div className="d-flex align-items-center">
                <input
                  type="search"
                  name="searchSequence"
                  id="searchSequence"
                  placeholder="Type to Search..."
                  className="form-control form-control-sm me-2"
                  style={{
                    width: "200px"
                  }}
                  onInput={handleSequenceSearch}
                />
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => {
                    openModal("createSequenceModal");
                    getLists();
                  }}
                >
                  <i className="fas fa-plus me-1"></i> Create Sequence
                </button>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => {
                    openModal("emailSettings");
                  }}
                >
                  <i className="fas fa-cog me-1"></i> Email Settings
                </button>
                <Link to="/templates" className="btn btn-sm btn-primary">
                  <i className="fas fa-pencil-ruler me-1"></i> Templates
                </Link>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sequence Name</th>
                    <th>Contact Count</th>
                    <th>Schedule</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sequence &&
                    sequence.map((seq) => {
                      return (
                        <tr key={seq.id}>
                          <td className="fw-bold">{seq.name}</td>
                          <td>{seq.contact_count}</td>
                          <td>{seq.frequency}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary me-2"
                              onClick={() => viewList(seq.id)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger me-2"
                              onClick={() => deleteList(seq.id)}
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-success me-2"
                              onClick={() => sendEmail(seq.id, seq.name)}
                            >
                              Send Email
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  {sequence.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-4 text-center">
                        <h5 className="mb-0">No result found</h5>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="modal" id="showContactModal" tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title w-100 text-center">{listName}</h5>
              <p className="text-primary position-absolute">
                Total Contacts: {totalContacts}
              </p>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("showContactModal")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                className="table-responsive border"
                style={{ height: "calc(100vh - 150px)", overflowY: "scroll" }}
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
                              return false;
                            }}
                            className="form-check-input mt-0 me-3"
                          />
                          <span>Person's Name</span>
                        </div>
                      </th>
                      {/* <th>Title</th> */}
                      <th>Company</th>
                      <th>Email</th>
                      <th>Direct Dial</th>
                      <th>Boardline Numbers</th>
                      <th>Contact Location</th>
                      <th>Company Location</th>
                    </tr>
                  </thead>
                  <tbody id="contactTable">
                    {peoples.length !== 0 && (
                      <ContactTableRow
                        TableData={peoples}
                        closeModal={closeModal}
                        showCompanyInfo={() => {
                          return false;
                        }}
                        selectAll={false}
                      />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="sendEmailModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Send Email Campaign</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("sendEmailModal")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={sendEmailCampaign}>
                <h6 className="mb-3 fw-bold">List Name: {sendListName}</h6>
                <div className="mb-3">
                  <label htmlFor="templateId" className="form-label">
                    Select Template
                  </label>
                  <select
                    name="templateId"
                    id="templateId"
                    className="form-select"
                    onChange={handleInputChange}
                  >
                    <option value="">--</option>
                    {templateList.length > 0 &&
                      templateList.map((list) => {
                        return (
                          <>
                            <option value={list._id} key={list._id}>
                              {list.name}
                            </option>
                          </>
                        );
                      })}
                  </select>
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-success">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="emailSettings" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Email Settings</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("emailSettings")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <SettingsEmailSetup />
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="createSequenceModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Create Sequence</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  closeModal("createSequenceModal");
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={createSequence}>
                <div className="mb-3">
                  <label htmlFor="sequenceName" className="form-label">
                    Name for Sequence
                  </label>
                  <input
                    type="text"
                    id="sequenceName"
                    className="form-control"
                    value={sequenceName}
                    onChange={(e) => {
                      setSequenceName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="schedule"
                      id="immediate"
                      value="immediate"
                      onClick={(e) => {
                        setShowSchedule(false);
                        setSeqFeq("immediate");
                      }}
                    />
                    <label className="form-check-label" htmlFor="immediate">
                      Send immediately
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="schedule"
                      id="scheduled"
                      value="scheduled"
                      onClick={() => {
                        setShowSchedule(true);
                        setSeqFeq("scheduled");
                      }}
                    />
                    <label className="form-check-label" htmlFor="scheduled">
                      Schedule my Sequence
                    </label>
                  </div>
                </div>
                {showSchedule && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Select Days</label>
                      <br />
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="mon"
                          value="mon"
                          onChange={handleDays}
                        />
                        <label className="form-check-label" htmlFor="mon">
                          Monday
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="tue"
                          value="tue"
                          onChange={handleDays}
                        />
                        <label className="form-check-label" htmlFor="tue">
                          Tuesday
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="wed"
                          value="wed"
                          onChange={handleDays}
                        />
                        <label className="form-check-label" htmlFor="wed">
                          Wednesday
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="thu"
                          value="thu"
                          onChange={handleDays}
                        />
                        <label className="form-check-label" htmlFor="thu">
                          Thursday
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="fri"
                          value="fri"
                          onChange={handleDays}
                        />
                        <label className="form-check-label" htmlFor="fri">
                          Friday
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="sat"
                          value="sat"
                          onChange={handleDays}
                        />
                        <label className="form-check-label" htmlFor="sat">
                          Saturday
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="sun"
                          value="sun"
                          onChange={handleDays}
                        />
                        <label className="form-check-label" htmlFor="sun">
                          Sunday
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="startDate" className="form-label">
                        Start From
                      </label>
                      {/* <input type="date" id="startDate" className="form-control" /> */}
                      <input
                        type="datetime-local"
                        name="startDate"
                        id="startDate"
                        className="form-control"
                        onChange={(e) => {
                          setSeqStartDateTime(e.target.value);
                        }}
                        value={seqStartDateTime}
                      />
                    </div>
                  </>
                )}
                <div className="mb-3">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="emails"
                      id="selectList"
                      value="selectList"
                      onChange={handleListOption}
                    />
                    <label className="form-check-label" htmlFor="selectList">
                      Select List
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="emails"
                      id="importCsv"
                      value="importCsv"
                      onChange={handleListOption}
                    />
                    <label className="form-check-label" htmlFor="importCsv">
                      Upload CSV
                    </label>
                  </div>
                </div>
                {showListOption && (
                  <div className="mb-3">
                    <label htmlFor="selectFrmList" className="form-label">
                      Select List
                    </label>
                    <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={selectedList}
                      isMulti
                      name="selectFrmList"
                      options={lists}
                      className="basic-multi-select"
                      placeholder="Select List"
                      onChange={setSelectedList}
                    />
                    {/* <select className="form-select" id="selectFrmList">
                      <option value="">--</option>
                      {lists.length > 0 &&
                        lists.map((l) => {
                          return (
                            <option value={l.id}>
                              {l.name} ({l.rcptcount})
                            </option>
                          );
                        })}
                    </select> */}
                  </div>
                )}
                {showUploadOption && (
                  <div className="mb-3">
                    <label htmlFor="uploadCSV" className="form-label">
                      Upload CSV File
                    </label>
                    <input
                      class="form-control"
                      type="file"
                      id="uploadCSV"
                    ></input>
                  </div>
                )}
                <button type="submit" className="btn btn-sm btn-success">
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop"
        id="modal-backdrop"
        style={{ display: "none", opacity: ".5" }}
      ></div>
    </>
  );
}

export default Sequences;
