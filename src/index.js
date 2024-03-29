import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./states/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";

// import LogRocket from "logrocket";
// LogRocket.init("yot0x9/testcl");

// store.subscribe(() => console.log(store.getState()))

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer theme="dark" position="bottom-center" />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
