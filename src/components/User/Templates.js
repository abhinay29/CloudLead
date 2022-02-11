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
      setTemplates(parsedData.lists);
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
            <div>
              <Link
                to="/sequences/template/create"
                className="btn btn-sm btn-primary me-2"
              >
                Create Template
              </Link>
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
                      <tr key={temp.id}>
                        <td className="fw-bold">{temp.name}</td>
                        <td>{temp.rcptcount}</td>
                        <td>View / Edit / Delete</td>
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
