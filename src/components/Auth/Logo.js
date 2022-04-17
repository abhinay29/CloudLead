import React from "react";

function Logo() {
  return (
    <div
      className="d-flex align-items-center position-absolute"
      style={{
        top: "10px",
        left: "10px"
      }}
    >
      <img src="/cl_logo.svg" alt="Logo" style={{ height: "40px" }} />
      <h5 className="fw-bold ms-2 mb-0">cloudlead.AI</h5>
    </div>
  );
}

export default Logo;
