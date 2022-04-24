<div className="row text-center justify-content-center">
  <div className="col-md-4 col-lg-4">
    <div className="p-5 bg-white rounded-lg shadow">
      <div style={{ height: "120px" }}></div>
      <hr className="bg-transparent" />
      <ul className="list-unstyled text-start">
        <li className="mb-2">
          <h6 className="mb-0">Email Credits</h6>
          <p className="small">
            (Number of contacts you can download per month)
          </p>
        </li>
        <li className="mb-2">
          <h6 className="mb-0">Contacts Unlock</h6>
          <p className="small">(Number of contacts you can unlock)</p>
        </li>
        <li className="mb-2">
          <h6 className="mb-0">Multi Selection Limit</h6>
          <p className="small">(Number of contacts you can select together)</p>
        </li>
        <li className="mb-2">
          <h6 className="mb-0">Daily Email sending Limit</h6>
          <p className="small">(via your SMTP server,Gsuite,Microsoft365)</p>
        </li>
        <li className="mb-2">
          <h6 className="mb-0">Online Email Verification</h6>
          <p className="small">(Single Selection)</p>
        </li>
        <li className="mb-2">
          <h6 className="mb-0">CSV Upload</h6>
          <p className="small">(Upload your own data for campaigns)</p>
        </li>
        <li className="mb-2">
          <h6 className="mb-0">Custom Data Request</h6>
          <p className="small">
            (Get only Email credits/Mobile numbers without Subscription)
          </p>
        </li>
        <li className="mb-2">
          <h6 className="mb-0">Email Pattern Finder</h6>
          <p className="small">(Online)</p>
        </li>
        <li className="mb-2">
          <h6 className="mb-0">Linkedin Chrome Extension</h6>
        </li>
      </ul>
    </div>
  </div>
  {plans.map((plan) => {
    return (
      <div className="col-md-3" style={{ width: "300px" }} key={plan.plan_id}>
        <div
          className={`bg-white rounded-lg shadow pb-5 ${
            plan.name === "Basic" ? "border border-2 border-primary" : ""
          }`}
        >
          <div
            style={{ height: "180px" }}
            className="bg-warning pt-5 text-white rounded-lg"
          >
            <h1 className="h5 text-uppercase fw-bold mb-3">{plan.name}</h1>
            {plan.price_inr === 0 ? (
              <>
                <h2 className="fw-bold">Free</h2>
                <p>&nbsp;</p>
              </>
            ) : (
              <>
                {plan.name === "Basic" ? (
                  <>
                    <h2 className="fw-bold">
                      ₹ {plan.price_inr}
                      <span className="text-small fw-normal ms-2">/ month</span>
                    </h2>
                    <p className="text-small">
                      (Per user, Per month) Billed Annually
                    </p>
                  </>
                ) : (
                  <>
                    <h4>(Let's Talk)</h4>
                  </>
                )}
              </>
            )}
          </div>
          {/* <div className="custom-separator my-3 mx-auto bg-primary"></div> */}
          <ul className="list-unstyled my-3 text-small text-left">
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">
                {plan.email_credit ? (
                  plan.email_credit
                ) : (
                  <div style={{ height: "25px" }}>--</div>
                )}
              </h6>
            </li>
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">
                {plan.contact_unlock === -1 ? "Unlimited" : plan.contact_unlock}
              </h6>
            </li>
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">
                {plan.multi_select === 0 ? "Not Available" : plan.multi_select}
              </h6>
            </li>
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">
                {plan.daily_email_limit === 0
                  ? "Not Available"
                  : `${plan.daily_email_limit}/day`}
              </h6>
            </li>
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">Free</h6>
            </li>
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">
                {plan.csv_upload === 0 ? "Not Available" : "Available"}
              </h6>
            </li>
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">Yes</h6>
            </li>
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">Free</h6>
            </li>
            <li className="mb-2 text-center">
              <h6 className="mb-0 fw-bold">Available</h6>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => subscribe(plan.plan_id)}
            className="btn btn-primary"
          >
            Choose Plan
          </button>
        </div>
      </div>
    );
  })}
</div>;
