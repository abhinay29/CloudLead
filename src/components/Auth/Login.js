import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { NotificationManager } from 'react-notifications';

const API_URL = process.env.REACT_APP_API_URL;

const Login = (props) => {

	const [disabled, setDisabled] = useState(false)
	const [credentials, setCredentials] = useState({ email: "", password: "" })
	let history = useHistory();

	const handleSubmit = async (e) => {
		setDisabled(true)
		e.preventDefault();
		const response = await fetch(`${API_URL}/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: credentials.email, password: credentials.password })
		});
		const json = await response.json()
		if (json.success) {
			// Save the auth token and redirect
			if (localStorage.getItem('searchQuery')) {
				localStorage.removeItem('searchQuery')
			}
			localStorage.setItem('token', json.authtoken);
			localStorage.setItem('uname', json.uname);
			localStorage.setItem('uemail', json.uemail);
			localStorage.removeItem('searchQuery')
			NotificationManager.success("Welcome back!!!")
			history.push("/");
		}
		else {
			NotificationManager.error(json.error, "Error!", 5000)
			setDisabled(false);
		}
	}

	const onChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value })
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
								<h3 className="fw-bold">Sign In</h3>
								<p className="mb-3 text-muted">Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur adipisicing.</p>
							</div>
							<form action="#" method="post" onSubmit={handleSubmit}>
								<div className="mb-3 first">
									<label htmlFor="username" className="form-label">Email</label>
									<input type="email" className="form-control p-2 border-1 border-primary" value={credentials.email} onChange={onChange} id="email" name="email" />
								</div>
								<div className="mb-3 last mb-3">
									<label htmlFor="password" className="form-label">Password</label>
									<input type="password" className="form-control p-2 border-1 border-primary" value={credentials.password} onChange={onChange} name="password" id="password" />
								</div>
								<div className="mb-4 d-flex">
									<span className="me-auto">
										<Link to="/signup" className="text-decoration-none">Need an Account?</Link>
									</span>
									<span className="ms-auto"><a href="/" className="forgot-pass text-decoration-none">Forgot Password?</a></span>
								</div>
								<input type="submit" value="Log In" disabled={disabled} className="btn py-3 btn-block w-100 btn-primary" />
								<span className="d-block text-center my-4 text-muted">— or —</span>
								<div className="social-login">
									<a href="/" className="btn btn-danger py-3 w-100 d-flex justify-content-center align-items-center" onClick={() => { alert('This would be work soon.'); }}>
										<i className="fab fa-google me-2"></i> Login with Google
									</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
