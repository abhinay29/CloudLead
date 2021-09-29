import React from 'react'
import { Link, useLocation, useHistory } from "react-router-dom";


const Navbar = () => {
	let history = useHistory();
	// eslint-disable-next-line
	const handleLogout = () => {
		localStorage.removeItem('token');
		history.push("/login");
	}
	// eslint-disable-next-line
	let location = useLocation();
	return (
		<>
			{/* <Link className="navbar-brand" to="/">B2B App</Link> */}
			<nav className="navbar top-nav navbar-expand-lg navbar-dark bg-primary">
				<div className="container-fluid">
					<Link className="navbar-brand me-4 p-0" to="/" style={{ "width": "40px", "height": "40px" }}>
						<div className="rounded-circle bg-dark d-flex justify-content-center align-items-center" style={{ "width": "40px", "height": "40px" }}>C</div>
					</Link>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<Link className={`nav-link ${location.pathname === '/' ? "active" : ""}`} aria-current="page" to="/"><i className="far fa-chart-bar"></i> Cockpit</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link ${location.pathname === '/radar/people' ? "active" : ""}`} to="/radar/people"><i className="fas fa-user-friends"></i> People</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link ${location.pathname === '/radar/company' ? "active" : ""}`} to="/radar/company"><i className="far fa-building"></i> Companies</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link ${location.pathname === '/radar/people/watchlist' ? "active" : ""}`} to="/radar/people/watchlist"><i className="far fa-bookmark"></i>My Watchlist</Link>
							</li>
							<li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" to="lists"><i className="far fa-list-alt"></i> Sequences</Link>
								<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
									<li><Link className="dropdown-item" to="/">Product One</Link></li>
									<li><Link className="dropdown-item" to="/">Product Two</Link></li>
									<li><Link className="dropdown-item" to="/">Product Three</Link></li>
									<li><Link className="dropdown-item" to="/">Product Four</Link></li>
									<li><Link className="dropdown-item" to="/">Product Five</Link></li>
									<li><Link className="dropdown-item" to="/">Product Six</Link></li>
									<li><Link className="dropdown-item" to="/">Product Seven</Link></li>
								</ul>
							</li>
						</ul>
						<ul className="navbar-nav ms-auto">
							<li className="nav-item me-3">
								<Link className="nav-link nav-btn" to="/">
									<span>Get Chrome Extension</span>
								</Link>
							</li>
							<li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" to="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Products </Link>
								<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
									<li><Link className="dropdown-item" to="/">Email Pattern Finder</Link></li>
									<li><Link className="dropdown-item" to="/">Online Email Validation</Link></li>
									<li className="nav-item dropstart">
										<Link className="dropdown-item dropdown-toggle" to="/" id="alternative-tools" data-bs-toggle="dropdown" aria-expanded="false">Alternative Tools</Link>
										<ul className="submenu submenu-left dropdown-menu" aria-labelledby="alternative-tools">
											<li><Link className="dropdown-item" to="/">Email List Cleaner</Link></li>
											<li><Link className="dropdown-item" to="/">File Merge (CSV/Excel)</Link></li>
											<li><Link className="dropdown-item" to="/">Duplicate Remover</Link></li>
											<li><Link className="dropdown-item" to="/">VLookup</Link></li>
											<li><Link className="dropdown-item" to="/">Appropriate / Fussy Vlookup</Link></li>
											<li><Link className="dropdown-item" to="/">Catagorization</Link></li>
											<li><Link className="dropdown-item" to="/">Offline Email Extracter from CSV/Excel</Link></li>
										</ul>
									</li>
									<li className="nav-item dropstart">
										<Link className="dropdown-item dropdown-toggle" to="/" id="outlook-tools" data-bs-toggle="dropdown" aria-expanded="false">Outlook Tools</Link>
										<ul className="submenu submenu-left dropdown-menu" aria-labelledby="outlook-tools">
											<li><Link className="dropdown-item" to="/">Outlook Mobile Number Extracter</Link></li>
											<li><Link className="dropdown-item" to="/">Auto Responder</Link></li>
										</ul>
									</li>
								</ul>
							</li>

							<li className="nav-item">
								<Link to="/" className="nav-link bi-tooltip" data-bas-placement="bottom" title="Theme" id="change-theme">
									<i className="fas fa-sun mx-1"></i>
									{/* <i className="fas fa-moon mx-1"></i> */}
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link bi-tooltip" to="/" data-bs-placement="bottom" title="Support"> <i className="far fa-life-ring mx-1"></i> </Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link bi-tooltip" to="/" data-bs-placement="bottom" title="Settings"> <i className="fas fa-cog mx-1"></i> </Link>
							</li>
							<li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" to="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									<span className="bi-tooltip" data-bs-placement="left" title="My Account">
										<span className="me-1">{localStorage.getItem('uemail')}</span>
									</span>
								</Link>
								{/* <li><Link className="dropdown-item" to="/"><i className="fas fa-user me-1 text-primary"></i> Profile</Link></li>
								<li><Link className="dropdown-item" to="logout.php"><i className="fas fa-power-off me-1 text-danger"></i> Logout</Link></li> */}
								<div className="dropdown-menu shadow" style={{ "width": "260px" }} aria-labelledby="navbarDropdown">
									<div className="py-2 px-3">
										<div className="text-center">
											<h6 className="fw-bold">{localStorage.getItem('uname')}</h6>
											<button type="button" onClick={handleLogout} className="btn btn-sm btn-danger"><i className="fas fa-power-off"></i> Logout</button>
										</div>
										<hr />
										<div className="text-center">
											<h5 className="fw-bold">Basic</h5>
										</div>
										<hr />
										<div>
											<p className="fw-bold mb-0">Usage Report</p>
											<p className="mb-0">Daily Unlock</p>
											<div className="progress">
												<div className="progress-bar" role="progressbar" style={{ "width": "40%" }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
											</div>
											<p className="small mb-2">2000 / 5000</p>
											<p className="mb-0">Monthly Unlock</p>
											<div className="progress">
												<div className="progress-bar" role="progressbar" style={{ "width": "20%" }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
											</div>
											<p className="small mb-2">2000 / 20000</p>
											<p className="mb-0">Downloads</p>
											<div className="progress mb-2">
												<div className="progress-bar" role="progressbar" style={{ "width": "5%" }} aria-valuenow="5" aria-valuemin="0" aria-valuemax="100"></div>
											</div>
											<p className="small mb-2">50 / 1000</p>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</nav >
		</>
	)
}

export default Navbar