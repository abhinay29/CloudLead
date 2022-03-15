import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { useSelector, useDispatch } from "react-redux";
import { progressLoading, userInfo, watchList } from "../states/action-creator";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Navbar = () => {
  const loadingState = useSelector((state) => state.setLoadingProgress);
  const userState = useSelector((state) => state.setUserData);
  const dispatch = useDispatch();

  let history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  const initiateUserInfo = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/api/auth/getuser`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          dispatch(userInfo(response.data.userdata));
          localStorage.removeItem("searchQuery");
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const initiateWatchlist = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/api/contacts/watchlist?page=1&limit=25`,
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.data.status === "success") {
          dispatch(watchList(response.data));
        } else {
          console.log(response);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    initiateWatchlist();
    initiateUserInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <LoadingBar
        color="#f11946"
        height={3}
        progress={loadingState}
        onLoaderFinished={() => dispatch(progressLoading(0))}
      />
      <nav className="navbar top-nav navbar-expand-lg bg-primary">
        <div className="container-fluid">
          <Link
            className="navbar-brand text-light me-4 d-flex align-items-center p-0"
            to="/"
            style={{ height: "40px" }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "40px", height: "40px" }}
            />
            <h5 className="fw-bold ms-3 mb-0">CLOUDLEAD</h5>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<Link className={`nav-link ${location.pathname === '/' ? "active" : ""}`} aria-current="page" to="/" onClick={() => linkClick()}><i className="far fa-chart-bar"></i> Cockpit</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link ${location.pathname === '/radar/people' ? "active" : ""}`} to="/radar/people" onClick={() => linkClick()}><i className="fas fa-user-friends"></i> People</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link ${location.pathname === '/radar/company' ? "active" : ""}`} to="/radar/company"><i className="far fa-building"></i> Companies</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link ${location.pathname === '/radar/people/watchlist' ? "active" : ""}`} to="/radar/people/watchlist" onClick={() => linkClick()}><i className="far fa-bookmark"></i>My Watchlist</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="lists"><i className="far fa-list-alt"></i> Sequences</Link>
							</li>
						</ul> */}
            <ul className="navbar-nav ms-auto">
              {/* <li className="nav-item me-3 d-flex align-items-center">
                <a
                  href="https://cloudlead.in"
                  className="nav-link active btn-sm px-3"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fas fa-globe me-2"></i> Back to Website
                </a>
              </li> */}
              {/* <li className="nav-item me-3 d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-warning fw-bold px-3"
                >
                  Get Chrome Extension
                </button>
              </li> */}

              {/* <li className="nav-item dropdown">
                <Link
                  className="nav-link"
                  to="/"
                  id="productMenu"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Products <i className="fas fa-chevron-down ms-1"></i>
                </Link>
                <div
                  className="dropdown-menu shadow-lg megamenu"
                  aria-labelledby="productMenu"
                >
                  <div
                    className="megamenu-container"
                    style={{ width: "850px" }}
                  >
                    <div className="row">
                      <div className="col-md-3">
                        <h6 className="text-muted menu-title">Tools</h6>
                      </div>
                      <div className="col-md-5">
                        <h6 className="text-muted menu-title">
                          Alternative Tools
                        </h6>
                      </div>
                      <div className="col-md-4">
                        <h6 className="text-muted menu-title">Outlook Tools</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <Link className="dropdown-item" to="/">
                          Email Pattern Finder
                        </Link>
                        <Link className="dropdown-item" to="/">
                          Online Email Validation
                        </Link>
                      </div>
                      <div className="col-md-5">
                        <Link className="dropdown-item" to="/">
                          Email List Cleaner
                        </Link>
                        <Link className="dropdown-item" to="/">
                          File Merge (CSV/Excel)
                        </Link>
                        <Link className="dropdown-item" to="/">
                          Duplicate Remover
                        </Link>
                        <Link className="dropdown-item" to="/">
                          VLookup
                        </Link>
                        <Link className="dropdown-item" to="/">
                          Appropriate / Fussy Vlookup
                        </Link>
                        <Link className="dropdown-item" to="/">
                          Catagorization
                        </Link>
                        <Link className="dropdown-item" to="/">
                          Offline Email Extracter from CSV/Excel
                        </Link>
                      </div>
                      <div className="col-md-4">
                        <Link className="dropdown-item" to="/">
                          Outlook Mobile Number Extracter
                        </Link>
                        <Link className="dropdown-item" to="/">
                          Auto Responder
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li> */}

              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link bi-tooltip"
                  data-bas-placement="bottom"
                  title="Theme"
                  id="change-theme"
                >
                  <i className="fas fa-sun mx-1"></i>
                  {/* <i className="fas fa-moon mx-1"></i> */}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link bi-tooltip"
                  to="/"
                  data-bs-placement="bottom"
                  title="Support"
                >
                  <i className="far fa-life-ring mx-1"></i>
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link"
                  to="/"
                  id="settingsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {" "}
                  <i className="fas fa-cog mx-1"></i>{" "}
                </Link>
                <ul
                  className="dropdown-menu shadow"
                  aria-labelledby="settingsDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user me-2"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/billing">
                      <i className="fas fa-file-invoice me-2"></i> Billing
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="fas fa-cog me-2"></i> Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/change-password">
                      <i className="fas fa-lock me-2"></i> Change Password
                    </Link>
                  </li>
                  <li>
                    <Link to="/feedback" className="dropdown-item">
                      <i className="fas fa-comment-alt me-2"></i> Feedback
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link"
                  to="/"
                  id="userAccountMenu"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    className="bi-tooltip"
                    data-bs-placement="left"
                    title="My Account"
                  >
                    <span className="me-1">{userState.email}</span>{" "}
                    <i className="fas fa-chevron-down"></i>
                  </span>
                </Link>
                {/* <li><Link className="dropdown-item" to="/"><i className="fas fa-user me-1 text-primary"></i> Profile</Link></li>
								<li><Link className="dropdown-item" to="logout.php"><i className="fas fa-power-off me-1 text-danger"></i> Logout</Link></li> */}
                <div
                  className="dropdown-menu shadow"
                  style={{ width: "260px" }}
                  aria-labelledby="userAccountMenu"
                >
                  <div className="py-2 px-3">
                    <div className="text-center">
                      <h6 className="fw-bold">
                        {userState.first_name} {userState.last_name}
                      </h6>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="btn btn-sm btn-danger"
                      >
                        <i className="fas fa-power-off"></i> Logout
                      </button>
                      <p
                        className="mt-2 fw-bold"
                        style={{ fontSize: ".75rem" }}
                      >
                        Last Login: {localStorage.getItem("lastLogin")}
                      </p>
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
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "40%" }}
                          aria-valuenow="40"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <p className="small mb-2">2000 / 5000</p>
                      <p className="mb-0">Monthly Unlock</p>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "20%" }}
                          aria-valuenow="20"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <p className="small mb-2">2000 / 20000</p>
                      <p className="mb-0">Downloads</p>
                      <div className="progress mb-2">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "5%" }}
                          aria-valuenow="5"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <p className="small mb-2">50 / 1000</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
