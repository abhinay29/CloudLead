import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { progressLoading } from "../../states/action-creator";

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

  useEffect(() => {
    getTemplates();
    // eslint-disable-next-line
  }, []);

  return (
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
                  <th>Email Subject</th>
                  <th>Updated On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {templates &&
                  templates.map((temp) => {
                    return (
                      <tr key={temp._id}>
                        <td className="fw-bold">{temp.name}</td>
                        <td>{temp.subject}</td>
                        <td>{temp.addedon}</td>
                        <td>
                          <a
                            href="#cloud"
                            className="text-dark me-2"
                            onClick={() => viewList(temp._id)}
                          >
                            <i className="fas fa-eye"></i>
                          </a>
                          <a
                            href="#cloud"
                            className="text-blue me-2"
                            onClick={() => viewList(temp._id)}
                          >
                            <i className="fas fa-pen"></i>
                          </a>
                          <a
                            href="#cloud"
                            className="text-success me-2"
                            onClick={() => viewList(temp._id)}
                            title="Send Email Campaign"
                          >
                            <i className="fas fa-envelope"></i>
                          </a>
                          <a
                            href="#cloud"
                            className="text-danger me-2"
                            onClick={() => viewList(temp._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </a>
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
  );
}

export default Templates;
