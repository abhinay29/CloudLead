import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
// import { NotificationManager } from 'react-notifications';
import { progressLoading } from "../../states/action-creator";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Sequences() {
  const dispatch = useDispatch();

  const [sequence, setSequence] = useState([]);

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

  useEffect(() => {
    getSequence();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="fullHeightWithNavBar p-4">
      <div className="card">
        <div className="card-body">
          <div className="cardTitle mb-4 d-flex justify-content-between align-items-center">
            <h5>Sequences</h5>
            <Link to="/templates" className="btn btn-sm btn-primary">
              Templates
            </Link>
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
                          <a
                            href="#cloud"
                            className="btn btn-sm btn-secondary me-2"
                          >
                            View
                          </a>
                          <a
                            href="#cloud"
                            className="btn btn-sm btn-primary me-2"
                          >
                            Edit
                          </a>
                          <a
                            href="#cloud"
                            className="btn btn-sm btn-danger me-2"
                          >
                            Delete
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

export default Sequences;
