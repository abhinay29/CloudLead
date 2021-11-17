import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { NotificationManager } from 'react-notifications';

const API_URL = process.env.REACT_APP_API_URL;

function ResetPassword(props) {

  const token = props.match.params.token;
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [disabled, setDisabled] = useState(false);

  if (!token) { window.location.href = "/"; return }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      NotificationManager.error("New Password and Confirm Password not matched.");
      return
    }

    setDisabled(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/resetpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, password: password })
      });
      const json = await res.json()
      setDisabled(false)
      if (json.status === 'success') {
        NotificationManager.success("Password has been reset successfully, you can login now.")
        setPassword("")
        setCPassword("")
      } else if (json.status === 'error') {
        NotificationManager.error(json.error)
      } else {
        NotificationManager.error("Something went wrong, please try again later")
      }
    } catch (error) {
      setDisabled(false)
      NotificationManager.error("Something went wrong, please try again later")
    }


  }

  const handleChange = (e) => {
    if (e.target.name === 'password') {
      setPassword(e.target.value);
    } else if (e.target.name === 'cpassword') {
      setCPassword(e.target.value);
    }
  }

  return (
    <div className="d-flex w-100 justify-content-center align-items-center" style={{ "height": "100vh" }}>
      <div className="bg order-1 order-md-2 w-50" style={{ "backgroundImage": "url(/assets/images/login.jpg)", "backgroundPosition": "center", "height": "100vh" }}></div>
      <div className="contents order-2 order-md-1 w-50">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-6">
              <div className="mb-3">
                <h4 className="text-uppercase fw-bold">Cloudlead</h4>
                <h3 className="fw-bold">Forgot Password?</h3>
                <p className="mb-3 text-muted">Enter your registered email and we will send you instruction to reset your cloudlead account password.</p>
              </div>
              <form action="#" method="post" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">New Password</label>
                  <input type="password" name="password" className="form-control p-2 border-1 border-primary" value={password} onChange={handleChange} id="password" autoComplete="new-password" />
                </div>
                <div className="mb-3">
                  <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                  <input type="password" name="cpassword" className="form-control p-2 border-1 border-primary" value={cpassword} onChange={handleChange} id="cpassword" autoComplete="confirm-password" />
                </div>
                <input type="submit" value="Set New Password" disabled={disabled} className="btn py-3 btn-block w-100 btn-success" />
                <span className="d-block text-center my-4 text-muted">— or —</span>
                <Link to="/login" className="btn py-3 btn-block w-100 btn-primary">Login</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
