import React from "react";

function LoginImages() {
  return (
    <div
      className="bg order-1 order-md-2 signup-content"
      style={{
        backgroundImage: "url(/assets/images/slide4.jpg)",
        // backgroundPosition: "center",
        height: "100vh",
        width: "65%"
      }}
    >
      <h5 className="text-warning mb-4 text-center px-5">
        Get instant access to Millions of Verified Emails and Direct Dials
        Powered by Lead Intelligence
      </h5>
      <div className="result-screenshot">
        <div className="image-one">
          <img src="/assets/images/result_one.png" />
        </div>
        <div className="image-two">
          <img src="/assets/images/result_two.png" />
        </div>
      </div>
    </div>
  );
}

export default LoginImages;
