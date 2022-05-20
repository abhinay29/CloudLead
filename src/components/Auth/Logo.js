import React from "react";

function Logo(props) {
  const { dark, bold } = props;
  return (
    <div
      className="d-flex align-items-center position-absolute"
      style={{
        top: "10px",
        left: "10px"
      }}
    >
      <img src="/cl_logo.svg" alt="Logo" style={{ height: "40px" }} />
      <h5 className={`${bold && "fw-bold"} ms-2 mb-0 ${!dark && "text-light"}`}>
        cloudlead.AI
      </h5>
    </div>
  );
}

Logo.defaultProps = {
  dark: true,
  bold: true
};

export default Logo;
