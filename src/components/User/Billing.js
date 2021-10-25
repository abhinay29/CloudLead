import React from 'react'
import UserMenu from './UserMenu'

function Billing() {
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
                <form action="">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Billing Address</label>
                        <input name="" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">City</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">State</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Country</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Pin Code</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="form-check form-switch">
                          <label className="form-check-label" style={{ "fontWeight": "600" }} htmlFor="gstApplicable">GST Applicable?(Optional)</label>
                          <input className="form-check-input" type="checkbox" role="switch" id="gstApplicable" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">GST Number</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button type="button" className="btn btn-primary px-5"><i className="fas fa-save me-2"></i>Save</button>
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
