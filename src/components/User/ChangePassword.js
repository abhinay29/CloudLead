import React, { useState } from 'react'
import { NotificationManager } from 'react-notifications';
import UserMenu from './UserMenu'

const API_URL = process.env.REACT_APP_API_URL;

function ChangePassword() {

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  }

  const changePassword = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      NotificationManager.error('New password and Confirm password does not match.', 'Error!');
      return false;
    }
    if (!password.newPassword || !password.currentPassword) {
      NotificationManager.error('Please fill all fields.', 'Error!');
      return false;
    }
    let url = `${API_URL}/api/user/changepassword`;
    let update = await fetch(url, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(password)
    })
    let parsedData = await update.json()
    if (parsedData.status === 'success') {
      NotificationManager.success('Password changed successfully.', 'Success!');
      setPassword({ ...password, currentPassword: "", newPassword: "", confirmPassword: "", })
    } else if (parsedData.status === 'error') {
      NotificationManager.error(parsedData.error, 'Error!');
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
                <div className="cardTitle">
                  <h5>Change Password</h5>
                </div>
                <div className="mt-4">
                  <form action="" id="changePassword" onSubmit={changePassword}>
                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">Current Password</label>
                      <input type="password" name="currentPassword" id="currentPassword" className="form-control" onChange={handleInputChange} value={password.currentPassword} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">New Password</label>
                      <input type="password" name="newPassword" id="newPassword" className="form-control" onChange={handleInputChange} value={password.newPassword} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" onChange={handleInputChange} value={password.confirmPassword} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Change Password</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default ChangePassword
