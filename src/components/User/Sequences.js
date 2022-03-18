import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { progressLoading } from "../../states/action-creator";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ContactTableRow from "../People/TableRow";

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

  const getSequence = async () => {
    dispatch(progressLoading(30));
    const url = `${API_URL}/api/user/list/detailed`;
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
      setSequence(parsedData.lists);
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
              <div>
                <Link className="btn btn-sm btn-primary me-2" to="/settings">
                  <i className="fas fa-cog me-2"></i> Email Settings
                </Link>
                <Link to="/templates" className="btn btn-sm btn-primary">
                  <i className="fas fa-pencil-ruler me-2"></i> Templates
                </Link>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Recipients</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sequence &&
                    sequence.map((seq) => {
                      return (
                        <tr key={seq.id}>
                          <td className="fw-bold">{seq.name}</td>
                          <td>{seq.rcptcount}</td>
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

      <div
        className="modal-backdrop"
        id="modal-backdrop"
        style={{ display: "none", opacity: ".5" }}
      ></div>
    </>
  );
}

export default Sequences;
