import React, { useEffect, useState } from 'react'
import UserMenu from './UserMenu'
import { useSelector } from 'react-redux';
import NotificationManager from 'react-notifications/lib/NotificationManager';

const API_URL = process.env.REACT_APP_API_URL;

function Billing() {

  const userState = useSelector(state => state.setUserData)

  const [billingInfo, setBillingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    gst: false,
    gst_number: "",
  })

  useEffect(() => {
    if (userState.billing_info) {
      setBillingInfo(userState.billing_info);
    }
  }, [userState.billing_info])

  const handleInput = (e) => {
    if (e.target.type === 'checkbox') {
      setBillingInfo({ ...billingInfo, [e.target.name]: e.target.checked });
    } else {
      setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = `${API_URL}/api/user/update/billing`;
    let update = await fetch(url, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(billingInfo)
    })
    let parsedData = await update.json()
    if (parsedData.status === 'success') {
      NotificationManager.success('Information updated successfully.', 'Success!');
    } else {
      NotificationManager.error('Something went wrong, please try again later.', 'Error!');
    }
  }

  return (
    <div className="fullHeightWithNavBar py-4">
      <div className="container">
        <div className="row">
          <div className="col" style={{ "maxWidth": "280px" }}>
            <UserMenu />
          </div>
          <div className="col" style={{ "width": "100%" }}>
            <div className="card">
              <div className="card-body">
                <div className="cardTitle mb-3">
                  <h5>Billing Information</h5>
                </div>
                <form action="" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Billing Address</label>
                        <input name="" className="form-control" name="address" onChange={handleInput} value={billingInfo.address} required />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">City</label>
                        <input type="text" className="form-control" name="city" onChange={handleInput} value={billingInfo.city} required />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">State</label>
                        <input type="text" className="form-control" name="state" onChange={handleInput} value={billingInfo.state} required />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Country</label>
                        <input type="text" className="form-control" name="country" onChange={handleInput} value={billingInfo.country} required />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Pin Code</label>
                        <input type="text" className="form-control" name="pin" onChange={handleInput} value={billingInfo.pin} required />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="form-check form-switch">
                          <label className="form-check-label" style={{ "fontWeight": "600" }} htmlFor="gstApplicable">GST Applicable?(Optional)</label>
                          <input className="form-check-input" type="checkbox" role="switch" id="gstApplicable" name="gst" onChange={handleInput} checked={billingInfo.gst} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">GST Number</label>
                        <input type="text" className="form-control" name="gst_number" onChange={handleInput} value={billingInfo.gst_number} required={billingInfo.gst} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary px-5"><i className="fas fa-save me-2"></i>Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Billing
