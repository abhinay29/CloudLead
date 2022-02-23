// import axios from 'axios';
import React from "react";
import UserMenu from "./UserMenu";

// const API_URL = process.env.REACT_APP_API_URL;

function Feedback() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    // let form = document.getElementById('feedbackForm');
    // let formData = new FormData(form);

    // const formJSON = {};
    // for (const [name, value] of formData) {
    //   formJSON[name] = value;
    // }

    // await axios({
    //   method: 'POST',
    //   mode: 'no-cors',
    //   url: `${API_URL}/api/feedback`,
    //   data: JSON.stringify(formJSON),
    //   headers: {
    //     'auth-token': localStorage.getItem('token'),
    //     'Content-Type': 'application/json'
    //   },
    // }).then(function (response) {
    //   //handle success
    //   console.log(response);
    // }).catch(function (err) {
    //   //handle error
    //   console.log(err);
    // });
  };

  return (
    <div className="fullHeightWithNavBar py-4">
      <div className="container">
        <div className="row">
          <div className="col" style={{ maxWidth: "280px" }}>
            <UserMenu />
          </div>
          <div className="col" style={{ width: "100%" }}>
            <div className="card">
              <div className="card-body">
                <div className="cardTitle mb-3">
                  <h5>Feedback</h5>
                </div>
                <form method="POST" id="feedbackForm" onSubmit={handleSubmit}>
                  <p>
                    You can always re-subscribe the account.Please leave us a
                    feedback.
                  </p>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="feedback_1"
                      value="Found a better product"
                      id="better_product"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="better_product"
                    >
                      Found a better product
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="feedback_2"
                      value="Not using anymore"
                      id="not_using_anymore"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="not_using_anymore"
                    >
                      Not using anymore
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="feedback_3"
                      value="Cant find companies or contacts"
                      id="cant_find"
                    />
                    <label className="form-check-label" htmlFor="cant_find">
                      Cant find companies or contacts
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="feedback_4"
                      value="Its too expensive"
                      id="too_expensive"
                    />
                    <label className="form-check-label" htmlFor="too_expensive">
                      Its too expensive
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="feedback_5"
                      value="Data quality issues"
                      id="quality_issues"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="quality_issues"
                    >
                      Data quality issues
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="feedback_6"
                      value="Found bugs in the product"
                      id="found_bug"
                    />
                    <label className="form-check-label" htmlFor="found_bug">
                      Found bugs in the product
                    </label>
                  </div>
                  <div className="my-3">
                    <textarea
                      name="feedbackText"
                      id="feedbackText"
                      className="form-control"
                      cols="30"
                      rows="2"
                      placeholder="Feedback (Optional)"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Send Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
