// import React, { useState } from "react";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;

// const initiateUserInfo = () => {
//   const [response, setResponse] = useState({});

//   await axios({
//     method: "GET",
//     url: `${API_URL}/api/auth/getuser`,
//     headers: {
//       "auth-token": localStorage.getItem("token"),
//       "Content-Type": "application/json"
//     }
//   })
//     .then(function (response) {
//       // if (response.data.status === "success") {
//       //   dispatch(userInfo(response.data.userdata));
//       //   localStorage.removeItem("searchQuery");
//       // } else {
//       //   console.log(response);
//       // }
//       // console.log(response);
//       setResponse(response.data);
//     })
//     .catch(function (err) {
//       console.log(err);
//     });

//   return response;
// };

// export default initiateUserInfo;
