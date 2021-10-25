import React from 'react'
import UserMenu from './UserMenu'

function Profile() {
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
                <div className="cardTitle mb-4">
                  <h5>My Profile</h5>
                </div>
                <form action="">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">First Name</label>
                        <input type="text" className="form-control" disabled />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Last Name</label>
                        <input type="text" className="form-control" disabled />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Email</label>
                        <input type="text" className="form-control" disabled />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Company</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Country Code</label>
                        <input type="text" className="form-control" placeholder="e.g. 91" />
                      </div>
                    </div>
                    <div className="col-md-9">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">Phone <small className="text-secondary">(You may receive an otp for payment verification on this number)</small></label>
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

export default Profile
