import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Verify(props) {
  const token = props.match.params.token;
  const [verified, setVerified] = useState();

  const checkToken = async () => {
    const url = `${API_URL}/api/user/verify`;
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });
    let res = await data.json();
    if (res.status) {
      setVerified(true);
    }
  };

  useEffect(() => {
    checkToken();
  });

  return (
    <div
      className="container mt-5 pt-5 text-center"
      style={{ maxWidth: "600px" }}
    >
      {!verified ? (
        <>
          <h6 className="alert alert-danger">
            Invalid Link, please check URL again.
          </h6>
          <Link to="/login" className="btn btn-primary">
            Go to Home
          </Link>
        </>
      ) : (
        <>
          <h6 className="alert alert-success">
            Thank you for verfiy your email, please login to continue
          </h6>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </>
      )}
      <p className="mt-5 text-muted">
        &copy; 2021, All Rights Reserved. CloudLead
      </p>
    </div>
  );
}

export default Verify;
