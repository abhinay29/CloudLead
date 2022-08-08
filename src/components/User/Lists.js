import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { progressLoading } from "../../states/action-creator";
import { toast } from "react-toastify";
import ContactTableRow from "../People/TableRow";

const API_URL = process.env.REACT_APP_API_URL;

function Lists() {
  const dispatch = useDispatch();
  const [lists, setLists] = useState([]);
  const [peoples, getPeoples] = useState([]);
  const [listName, setListName] = useState("");
  const [totalContacts, setTotalContacts] = useState(0);

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
      setLists(parsedData.lists);
    }
    dispatch(progressLoading(100));
  };

  const deleteList = async (id) => {
    if (!window.confirm("Do you really want to delete this list?")) {
      return;
    }
    dispatch(progressLoading(30));
    let url = `${API_URL}/api/user/list/delete?id=${id}`;
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
      toast.success("List Deleted Successfully");
      getLists();
    } else {
      toast.error("Something went wrong, please try again later.");
    }
    dispatch(progressLoading(100));
  };

  useEffect(() => {
    getLists();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="fullHeightWithNavBar p-4">
        <div className="card">
          <div className="card-body">
            <div className="cardTitle mb-4 d-flex justify-content-between align-items-center">
              <h5>Lists</h5>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>List Name</th>
                    <th>Recipients</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lists &&
                    lists.map((list) => {
                      return (
                        <tr key={list.id}>
                          <td className="fw-bold">{list.name}</td>
                          <td>{list.rcptcount}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary me-2"
                              onClick={() => viewList(list.id)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger me-2"
                              onClick={() => deleteList(list.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  {lists.length === 0 && (
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

      <div
        className="modal-backdrop"
        id="modal-backdrop"
        style={{ display: "none", opacity: ".5" }}
      ></div>
    </>
  );
}

export default Lists;
