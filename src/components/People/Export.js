import axios from "axios";
import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

const API_URL = process.env.REACT_APP_API_URL;

function Export(props) {
  const token = props.match.params.token;
  // eslint-disable-next-line
  const [csvData, setCsvData] = useState([]);

  // let headers = [
  //   { label: "First Name", key: "firstname" },
  //   { label: "Last Name", key: "lastname" },
  //   { label: "Email", key: "email" }
  // ];

  const initiateDownload = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/api/contacts/watchlist/download`,
      data: JSON.stringify({ token: token }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (err) {
        //handle error
        console.log(err);
      });
  };

  useEffect(() => {
    initiateDownload();
    // eslint-disable-next-line
  }, [token]);

  // let data = [
  //   { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
  //   { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
  //   { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
  // ];

  const filename = "Contacts-cloudlead.csv";

  const closeWindow = () => {
    setTimeout(function () {
      window.location.href = "/";
    }, 5000);
  };

  return (
    <div className="p-3 text-center">
      {!csvData && <div>Please wait...</div>}
      {csvData && (
        <div>
          <CSVLink
            data={csvData}
            filename={filename}
            onClick={closeWindow}
            target="_blank"
          >
            Download File
          </CSVLink>
        </div>
      )}
    </div>
  );
}

export default Export;
