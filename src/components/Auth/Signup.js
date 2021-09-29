import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

const API_URL = process.env.REACT_APP_API_URL;

const Signup = (props) => {
	const [credentials, setCredentials] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		cpassword: ""

	})
	let history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (credentials.password !== credentials.cpassword) {
			alert('Passsword & Confirmed password does not matched');
			return false;
		}
		const response = await fetch(`${API_URL}/api/auth/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				first_name: credentials.first_name,
				last_name: credentials.last_name,
				email: credentials.email,
				password: credentials.password
			})
		});
		const json = await response.json()
		console.log(json);
		if (json.status === 'success') {
			alert('Thank you for create account, please login to continue');
			history.push("/login");
			return false;
		} else if (json.status === 'error') {
			alert(json.errors[0].msg);
		} else {
			alert("Something went wrong please try again later.");
		}
	}

	const onChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value })
	}

	return (
		<div className="d-flex w-100 justify-content-center align-items-center" style={{ "height": "100vh" }}>
			<div className="contents order-2 order-md-2 w-50">
				<div className="container">
					<div className="row align-items-center justify-content-center">
						<div className="col-md-6">
							<div className="mb-3">
								<h4 className="text-uppercase fw-bold">Cloudlead</h4>
								<h4 className="">Create Account</h4>
							</div>
							<form action="#" method="post" onSubmit={handleSubmit}>
								<div className="mb-3">
									<input type="text" className="form-control p-2 border-1 border-primary" value={credentials.fist_name} onChange={onChange} id="first_name" name="first_name" placeholder="First Name" />
								</div>
								<div className="mb-3 first">
									<input type="text" className="form-control p-2 border-1 border-primary" value={credentials.last_name} onChange={onChange} id="last_name" name="last_name" placeholder="Last Name" />
								</div>
								<div className="mb-3 first">
									<input type="email" className="form-control p-2 border-1 border-primary" value={credentials.email} onChange={onChange} id="email" name="email" placeholder="Email" />
								</div>
								<div className="mb-3 last mb-3">
									<input type="password" className="form-control p-2 border-1 border-primary" value={credentials.password} onChange={onChange} name="password" id="password" placeholder="Password" />
								</div>
								<div className="mb-3 last mb-3">
									<input type="password" className="form-control p-2 border-1 border-primary" value={credentials.cpassword} onChange={onChange} name="cpassword" id="cpassword" placeholder="Confirm Password" />
								</div>
								<input type="submit" value="Signup" className="btn py-3 btn-block w-100 btn-primary" />
								<span className="d-block text-center my-4 text-muted">— or —</span>
								<div className="social-login">
									<a href="#" className="btn btn-danger py-3 w-100 d-flex justify-content-center align-items-center" onClick={() => { alert('This would be work soon.'); }}>
										<i className="fab fa-google me-2"></i> Signup with Google
									</a>
								</div>
							</form>
							<div className="text-center mt-3">
								<Link to="/login" className="text-decoration-none"> Already have an account?</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg order-1 order-md-1 w-50" style={{ "backgroundImage": "url(/assets/images/login.jpg)", "backgroundPosition": "center", "height": "100vh" }}></div>
		</div>
	)
}

export default Signup
