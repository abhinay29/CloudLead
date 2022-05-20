import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { progressLoading } from "../../states/action-creator";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip, Popover } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

function Templates() {
  const dispatch = useDispatch();

  const [templates, setTemplates] = useState([]);

  const getTemplates = async () => {
    dispatch(progressLoading(30));
    const url = `${API_URL}/api/user/templates`;
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
      setTemplates(parsedData.template_list);
    }
    dispatch(progressLoading(100));
  };

  const viewList = async (id) => {
    dispatch(progressLoading(30));
    const url = `${API_URL}/api/user/templates/list/${id}`;
    let listView = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    dispatch(progressLoading(50));
    let res = await listView.json();
    if (res.status === "success") {
      setTemplates(res.templateDetails);
    }
    dispatch(progressLoading(100));
  };

  const deleteTemplate = async (id) => {
    dispatch(progressLoading(30));
    const url = `${API_URL}/api/user/template/${id}`;
    let delTemplate = await fetch(url, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    dispatch(progressLoading(50));
    let res = await delTemplate.json();
    if (res.status === "success") {
      toast.success(res.message);
      getTemplates();
    } else if (res.status === "error") {
      toast.error(res.error);
    } else {
      toast.error("Something went wrong, please try again later");
    }
    dispatch(progressLoading(100));
  };

  const previewTemplate = async (id) => {
    openModal("previewTemplate");
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

  useEffect(() => {
    getTemplates();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="fullHeightWithNavBar p-4">
        <div className="card">
          <div className="card-body">
            <div className="cardTitle mb-4 d-flex justify-content-between align-items-center">
              <h5>Templates</h5>
              <div className="d-flex">
                <div className="dropdown me-2">
                  <button
                    className="btn btn-primary btn-sm dropdown-toggle"
                    type="button"
                    id="createTemplateDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Create Template
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="createTemplateDropdown"
                  >
                    <li>
                      <Link to="/template/create" className="dropdown-item">
                        Use Rich text editor
                      </Link>
                    </li>
                    <li>
                      <Link to="/template/create-dnd" className="dropdown-item">
                        Use Drag and Drop Editor
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link to="/sequences" className="btn btn-sm btn-primary">
                  Sequences
                </Link>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Template Name</th>
                    <th>Editor Type</th>
                    <th>Email Subject</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates &&
                    templates.map((temp) => {
                      return (
                        <tr key={temp._id}>
                          <td className="fw-bold">{temp.name}</td>
                          <td>
                            {temp.type === "rte" && (
                              <span className="badge bg-primary">
                                Rich Text
                              </span>
                            )}
                            {temp.type === "dnd" && (
                              <span className="badge bg-info">
                                Drag and Drop
                              </span>
                            )}
                          </td>
                          <td>{temp.subject}</td>
                          <td>{temp.addedon}</td>
                          <td>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Preview Template</Tooltip>}
                            >
                              <a
                                href="#cloud"
                                className="text-info me-3"
                                onClick={() => previewTemplate(temp._id)}
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Edit Template</Tooltip>}
                            >
                              <a
                                href="#cloud"
                                className="text-blue me-3"
                                onClick={() => viewList(temp._id)}
                              >
                                <i className="fas fa-edit"></i>
                              </a>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Clone Template</Tooltip>}
                            >
                              <a
                                href="#cloud"
                                className="text-warning me-3"
                                onClick={(e) => e.preventDefault()}
                              >
                                <i className="far fa-clone"></i>
                              </a>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Delete Template</Tooltip>}
                            >
                              <a
                                href="#cloud"
                                className="text-danger"
                                onClick={() => deleteTemplate(temp._id)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </a>
                            </OverlayTrigger>
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
      <div className="modal" id="previewTemplate" tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("previewTemplate")}
                aria-label="Close"
                style={{ zIndex: "1" }}
              ></button>
            </div>
            <div className="modal-body"></div>
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

export default Templates;
