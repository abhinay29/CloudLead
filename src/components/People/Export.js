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
      url: `${API_URL}/api/contacts/watchlist/download?token=${token}`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        //handle success
        var output = [];
        response.data.data.map((res) => {
          return output.push({
            first_name: res.first_name,
            last_name: res.last_name,
            title: res.title,
            email: res.email,
            organization_name: res.organization.organization_name,
            linkedin_id: res.linkedin_id,
            city: res.city,
            state: res.state,
            country: res.country,
            seniority: res.seniority,
            role: res.role,
            department: res.department,
            company_type: res.organization.company_type,
            industry: res.organization.industry,
            size_range: res.organization.size_range,
            org_country: res.organization.org_country,
            org_city: res.organization.org_city,
            website_link: res.organization.website_link
          });
        });
        setCsvData(output);
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

  const click = () => {
    document.getElementById("downloadBtn").click();
  };

  // useEffect(() => {
  //   click();
  // }, [csvData]);

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
            id="downloadBtn"
          >
            Click here to download file
          </CSVLink>
        </div>
      )}
    </div>
  );
}

export default Export;
