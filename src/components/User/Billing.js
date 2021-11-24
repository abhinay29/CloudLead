import React, { useEffect, useState } from 'react'
import UserMenu from './UserMenu'
import { useSelector } from 'react-redux';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import easyinvoice from 'easyinvoice';

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

  const [transactions, setTransactions] = useState([])

  const fetchTransactions = async () => {
    let url = `${API_URL}/api/user/billinghistory`;
    let data = await fetch(url, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(billingInfo)
    })
    let parsedData = await data.json()
    if (parsedData.status === 'success') {
      setTransactions(parsedData.data);
    }
  }
  useEffect(() => {
    fetchTransactions();
  }, [])

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

  const downloadInvoice = async (orderId) => {
    let url = `${API_URL}/api/payment/invoice`;
    let update = await fetch(url, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId: orderId, email: localStorage.getItem('uemail') })
    })
    let parsedData = await update.json()
    if (parsedData.status === 'success') {
      // NotificationManager.success('Success', 'Success!');
      easyinvoice.download(`${orderId}.pdf`, parsedData.pdf);
    } else {
      NotificationManager.error(parsedData.error, 'Error!');
    }
  }

  return (
    <>
      <div className="fullHeightWithNavBar py-4">
        <div className="container">
          <div className="row">
            <div className="col" style={{ "maxWidth": "280px" }}>
              <UserMenu />
            </div>
            <div className="col" style={{ "width": "100%" }}>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="cardTitle d-flex justify-content-between align-items-center mb-3">
                    <h5>Billing</h5>
                    <button type="button" className="btn btn-sm btn-primary">Upgrade Plan</button>
                  </div>
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#billingInfo" type="button" role="tab" aria-controls="billingInfo" aria-selected="true">Billing Information</button>
                      <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#billingHistory" type="button" role="tab" aria-controls="billingHistory" aria-selected="false">Billing History</button>
                    </div>
                  </nav>
                  <div className="tab-content mt-3" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="billingInfo" role="tabpanel" aria-labelledby="nbillingInfo-tab">
                      <form action="" onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label htmlFor="" className="form-label">Billing Address</label>
                              <input type="text" className="form-control" name="address" onChange={handleInput} value={billingInfo.address} required />
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
                    <div className="tab-pane fade" id="billingHistory" role="tabpanel" aria-labelledby="billingHistory-tab">
                      <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                          <thead>
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Order ID</th>
                              <th scope="col">Amount</th>
                              <th scope="col">Status</th>
                              <th scope="col">Receipt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.length === 0 && <tr><td colSpan="5" className="py-3 text-center fs-6">No history found</td></tr>}
                            {transactions.length > 0 && transactions.map(trans => {
                              let date = new Date(trans.date);
                              date = date.toLocaleDateString('en-UK');
                              return (
                                <tr key={trans.orderId}>
                                  <td>{date}</td>
                                  <td>{trans.orderId}</td>
                                  <td className="text-end">₹ {trans.amount}.00</td>
                                  <td>{trans.status}</td>
                                  <td>
                                    {trans.status === 'Completed' &&
                                      <button className="btn btn-sm btn-primary" onClick={() => { downloadInvoice(trans.orderId) }}>Download Invoice</button>}
                                  </td>
                                </tr>)
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="upgradePlanModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Billing
