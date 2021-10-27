import React, { useState } from 'react'
import { CSVLink } from "react-csv";

function Export(props) {

  const token = props.match.params.token;
  const [csvData, setCsvData] = useState([]);

  

  let headers = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" }
  ];

  let data = [
    { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
    { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
    { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
  ];

  const filename = "Contacts.csv";

  const closeWindow = () => {
    setTimeout(function () {
      window.location.href = "/";
    }, 3000);
  }

  return (
    <div className="p-3 text-center">
      <div>
        Please wait...
      </div>
      <div>
        {/* <CSVDownload data={csvData} filename={filename} /> */}
        <CSVLink
          data={data}
          filename={filename}
          onClick={closeWindow}
          target="_blank"
        >
          Download File
        </CSVLink>
      </div>
    </div>
  )
}

export default Export
