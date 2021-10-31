import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NotificationManager } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL;

function SubscribePlan() {

  const userState = useSelector(state => state.setUserData)

  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState({})
  const uemail = localStorage.getItem('uemail');
  const uname = localStorage.getItem('uname');
  const [invalidPhoneMsg, setInvalidPhoneMsg] = useState("");
  // const [formData, setFormData] = useState({
  //   country_code: '',
  //   phone: '',
  //   company_name: ''
  // });
  const [profile, setProfile] = useState({
    country_code: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    gst: false,
    gst_number: "",
  })

  // useEffect(() => {
  //   if (userState) {
  //     setProfile({ company: userState.company, phone: userState.phone, country_code: userState.country_code });
  //   }
  // }, [userState])

  const handleInput = (e) => {
    if (e.target.type === 'checkbox') {
      setProfile({ ...profile, [e.target.name]: e.target.checked });
    } else {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  }

  const getPlans = async () => {
    let Plans = await fetch(`${API_URL}/api/plans`);
    let res = await Plans.json()
    setPlans(res)
  }
  useEffect(() => {
    getPlans()
  }, [])

  const subscribe = async (pid) => {
    let Plan = await fetch(`${API_URL}/api/plans/${pid}`);
    let res = await Plan.json()
    setSelectedPlan(res);
    openModal('billingInformation')
  }

  // const handleInput = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // }

  const handleFormValidation = () => {
    let companyInput = document.getElementById("company");
    if (!profile.company) {
      companyInput.classList.add('is-invalid');
      NotificationManager.error("Please enter your company name");
      return false;
    } else {
      companyInput.classList.add('is-valid')
      companyInput.classList.remove('is-invalid');
    }
    if (!profile.country_code) {
      NotificationManager.error("Please enter valid country code");
      return false;
    }
    if (!profile.phone) {
      let phoneNumberInput = document.getElementById("phoneNumber");
      NotificationManager.error("Please enter valid phone no.");
      setInvalidPhoneMsg("Please enter valid phone no.")
      phoneNumberInput.focus()
      phoneNumberInput.classList.add('is-invalid');
      return false;
    }
    // phone: "",
    //   company: "",
    //     address: "",
    //       city: "",
    //         state: "",
    //           country: "",
    //             pin: "",
    //               gst: false,
    //                 gst_number: "",
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // if (!handleFormValidation()) {
    //   return false;
    // }
    let User = await fetch(`${API_URL}/api/user/checkphone/${profile.phone}`, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
    });
    let res = await User.json()

    if (res.status === 'error') {
      let phoneNumberInput = document.getElementById("phoneNumber");
      NotificationManager.error(res.error);
      setInvalidPhoneMsg("A user with this phone number is already exists.");
      phoneNumberInput.focus()
      phoneNumberInput.classList.add('is-invalid');
      return false;
    }

    document.getElementById("phoneNumber").classList.remove('is-invalid');
    closeModal('billingInformation')
    openModal('tosModal')
  }

  const acceptTerms = () => {
    closeModal('tosModal');
    openModal('orderSummery');
  }

  const handleSubscribePlan = async () => {
    let Subscribe = await fetch(`${API_URL}/api/user/subscribe`, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: profile.phone,
        plan: selectedPlan.plan_id,
        company: profile.company_name
      })
    });
    let res = await Subscribe.json()
    if (res.status === 'success') {
      NotificationManager.success(`Welcome! ${uname}`);
      window.location.reload();
    } else {
      NotificationManager.error(res.error);
    }
  }

  const openModal = (modalId) => {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden'
    var modal = document.getElementById(modalId);
    modal.classList.add('show');
    modal.style.display = 'block';
    let modalBackdrop = document.getElementById('modal-backdrop');
    modalBackdrop.style.display = "block";
  }

  const closeModal = (modalId) => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'visible'
    document.body.style.padding = '0'
    var modal = document.getElementById(modalId);
    modal.classList.remove('show');
    modal.style.display = 'none';
    let modalBackdrop = document.getElementById('modal-backdrop');
    modalBackdrop.style.display = "none";
  }

  let history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push("/login");
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {

    console.log("trigger click")

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post(`${API_URL}/api/payment/orders`, {
      planId: selectedPlan.plan_id
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency, receipt } = result.data;

    const options = {
      key: "rzp_test_SqK219lnN6lSiA",
      amount: amount.toString(),
      currency: currency,
      name: "TB.net",
      description: "Transaction for " + selectedPlan.plan_id,
      image: '/logo.png',
      order_id: order_id,
      handler: async function (response) {
        const data = {
          name: uname,
          email: uemail,
          contact: profile.phone,
          company: profile.company_name,
          country_code: profile.country_code,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          pin: profile.pin,
          gst: profile.gst,
          gst_number: profile.gst_number,
          planId: selectedPlan.plan_id,
          receipt: receipt,
          amount: parseInt(amount) / 100,
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(`${API_URL}/api/payment/success`, data, {
          headers: {
            'auth-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });

        if (result.data.status === 'success') {
          NotificationManager.success('Thank you for choosing us.', `Welcome! ${uname}`);
          closeModal('orderSummery');
          window.location.reload();
        }
      },
      prefill: {
        name: uname,
        email: uemail,
        contact: profile.phone,
      },
      theme: {
        color: "#7367f0",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <>
      <div className="subscribe-container p-5">
        <div className="position-absolute" style={{ 'top': "20px", "right": "20px" }}>
          <button type="button" className="btn btn-sm btn-danger" onClick={handleLogout}><i className="fas fa-power-off"></i> Logout</button>
        </div>
        <h4 className="text-center mb-5">Choose a Plan</h4>
        <div className="container px-5">
          <div className="row text-center justify-content-center align-items-end">
            {plans.map(plan => {
              return (
                <div className="col-lg-4" key={plan.plan_id}>
                  <div className={`bg-white p-5 rounded-lg shadow ${plan.name === 'Basic' ? "border border-2 border-primary" : ""}`}>
                    <h1 className="h5 text-uppercase fw-bold mb-3">{plan.name}</h1>
                    {plan.price_inr === 0 ? (<><h2 className="fw-bold">Free</h2><p>&nbsp;</p></>) : (<><h2 className="fw-bold">₹ {plan.price_inr}<span className="text-small fw-normal ms-2">/ month</span></h2><p className="text-small">*Annual Commitment</p></>)}
                    <div className="custom-separator my-3 mx-auto bg-primary"></div>
                    <ul className="list-unstyled my-3 text-small text-left">
                      <li className="mb-2 text-center">
                        <p className="mb-2">Daily Unlock</p> <h5 className="mb-0 fw-bold">{plan.unlock_daily}</h5>
                      </li>
                      <li className="mb-2 text-center">
                        <p className="mb-2">Monthly Unlock</p> <h5 className="mb-0 fw-bold">{plan.unlock_month}</h5>
                      </li>
                      <li className="mb-2 text-center">
                        <p className="mb-2">Downloads</p> <h5 className="mb-0 fw-bold">{plan.download}</h5>
                      </li>
                    </ul>
                    <button type="button" onClick={() => subscribe(plan.plan_id)} className="btn btn-outline-primary">Subscribe</button>
                  </div>
                </div>
              )
            })
            }
          </div>
        </div>
      </div >

      <div className="modal fade" id="tosModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="tosLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="tosLabel">Terms and Conditions</h4>
              <button type="button" className="btn-close" onClick={() => closeModal('tosModal')} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h3>Welcome to Cloudlead!</h3>

              <p>These terms and conditions outline the rules and regulations for the use of Cloudlead's Website, located at https://cloudlead.in.</p>

              <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Cloudlead if you do not agree to take all of the terms and conditions stated on this page.</p>

              <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

              <h3><strong>Cookies</strong></h3>

              <p>We employ the use of cookies. By accessing Cloudlead, you agreed to use cookies in agreement with the Cloudlead's Privacy Policy. </p>

              <p>Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>

              <h3><strong>License</strong></h3>

              <p>Unless otherwise stated, Cloudlead and/or its licensors own the intellectual property rights for all material on Cloudlead. All intellectual property rights are reserved. You may access this from Cloudlead for your own personal use subjected to restrictions set in these terms and conditions.</p>

              <p>You must not:</p>
              <ul>
                <li>Republish material from Cloudlead</li>
                <li>Sell, rent or sub-license material from Cloudlead</li>
                <li>Reproduce, duplicate or copy material from Cloudlead</li>
                <li>Redistribute content from Cloudlead</li>
              </ul>

              <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Cloudlead does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Cloudlead,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, Cloudlead shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.</p>

              <p>Cloudlead reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.</p>

              <p>You warrant and represent that:</p>

              <ul>
                <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
                <li>The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy</li>
                <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
              </ul>

              <p>You hereby grant Cloudlead a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.</p>

              <h3><strong>Hyperlinking to our Content</strong></h3>

              <p>The following organizations may link to our Website without prior written approval:</p>

              <ul>
                <li>Government agencies;</li>
                <li>Search engines;</li>
                <li>News organizations;</li>
                <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
              </ul>

              <p>These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.</p>

              <p>We may consider and approve other link requests from the following types of organizations:</p>

              <ul>
                <li>commonly-known consumer and/or business information sources;</li>
                <li>dot.com community sites;</li>
                <li>associations or other groups representing charities;</li>
                <li>online directory distributors;</li>
                <li>internet portals;</li>
                <li>accounting, law and consulting firms; and</li>
                <li>educational institutions and trade associations.</li>
              </ul>

              <p>We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Cloudlead; and (d) the link is in the context of general resource information.</p>

              <p>These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.</p>

              <p>If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Cloudlead. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.</p>

              <p>Approved organizations may hyperlink to our Website as follows:</p>

              <ul>
                <li>By use of our corporate name; or</li>
                <li>By use of the uniform resource locator being linked to; or</li>
                <li>By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.</li>
              </ul>

              <p>No use of Cloudlead's logo or other artwork will be allowed for linking absent a trademark license agreement.</p>

              <h3><strong>iFrames</strong></h3>

              <p>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</p>

              <h3><strong>Content Liability</strong></h3>

              <p>We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>

              <h3><strong>Your Privacy</strong></h3>

              <p>Please read Privacy Policy</p>

              <h3><strong>Reservation of Rights</strong></h3>

              <p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>

              <h3><strong>Removal of links from our website</strong></h3>

              <p>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</p>

              <p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>

              <h3><strong>Disclaimer</strong></h3>

              <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>

              <ul>
                <li>limit or exclude our or your liability for death or personal injury;</li>
                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
              </ul>

              <p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>

              <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => closeModal('tosModal')}>Close</button>
              {selectedPlan &&
                <button type="button" className="btn btn-primary" onClick={selectedPlan.plan_id === 1 ? handleSubscribePlan : acceptTerms}>Accept &amp; Continue with {selectedPlan.name}</button>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="billingInformation" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="tosLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="tosLabel">Billing Information</h4>
              <button type="button" className="btn-close" onClick={() => closeModal('billingInformation')} aria-label="Close"></button>
            </div>
            <form onSubmit={handleFormSubmit} className="needs-validation">
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 border-right border-end">
                    {selectedPlan &&
                      <div className="text-center">
                        <h3>{selectedPlan.name}</h3>
                        <hr />
                        <h6>Daily Unlock</h6>
                        <h5 className="mb-3">{selectedPlan.unlock_daily}</h5>
                        <h6>Monthly Unlock</h6>
                        <h5 className="mb-3">{selectedPlan.unlock_month}</h5>
                        <h6>CSV Download</h6>
                        <h5 className="mb-3">{selectedPlan.download}</h5>
                      </div>
                    }
                  </div>
                  <div className="col-md-8">
                    <div className="p-3" style={{ "maxHeight": "500px", "overflowY": "auto" }}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">First Name</label>
                            <input type="text" className="form-control" value={userState.first_name} disabled />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Last Name</label>
                            <input type="text" className="form-control" value={userState.last_name} disabled />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Email</label>
                            <input type="text" className="form-control" value={userState.email} disabled />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Company Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" name="company" id="company" onChange={handleInput} value={profile.company} required />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Country Code <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" placeholder="e.g. 91" name="country_code" onChange={handleInput} value={profile.country_code} required />
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Phone <span className="text-danger">*</span><small className="text-secondary">(You may receive an otp for payment verification on this number)</small></label>
                            <input type="text" className="form-control" name="phone" id="phoneNumber" onChange={handleInput} value={profile.phone} required />
                            <div id="invalidPhone" className="invalid-feedback">
                              {invalidPhoneMsg}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Billing Address <span className="text-danger">*</span></label>
                            <input name="" className="form-control" name="address" onChange={handleInput} value={profile.address} required />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Country <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" name="country" onChange={handleInput} value={profile.country} required />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">State <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" name="state" onChange={handleInput} value={profile.state} required />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">City <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" name="city" onChange={handleInput} value={profile.city} required />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Pin Code</label>
                            <input type="text" className="form-control" name="pin" onChange={handleInput} value={profile.pin} />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <div className="form-check form-switch">
                              <label className="form-check-label" style={{ "fontWeight": "600" }} htmlFor="gstApplicable">GST Applicable?(Optional)</label>
                              <input className="form-check-input" type="checkbox" role="switch" id="gstApplicable" name="gst" onChange={handleInput} checked={profile.gst} />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">GST Number {profile.gst && <span className="text-danger">*</span>}</label>
                            <input type="text" className="form-control" name="gst_number" onChange={handleInput} value={profile.gst_number} required={profile.gst} />
                          </div>
                        </div>
                      </div>
                      {/* <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="">Name</label>
                          <input type="text" className="form-control" value={uname} readOnly />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="">Email</label>
                          <input type="text" className="form-control" value={uemail} readOnly />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="">Country Code <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" name="country_code" onChange={handleInput} value={formData.country_code} required placeholder="e.g. 91 for India" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="">Phone <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" name="phone" id="phoneNumber" onChange={handleInput} value={formData.phone} required />
                          <div id="invalidPhone" className="invalid-feedback">
                            A user with this phone number is already exists.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="">Comapany Name <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" name="company_name" onChange={handleInput} value={formData.company_name} required />
                        </div>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                {selectedPlan && <input type="hidden" name="plan_id" value={selectedPlan.plan_id} />}
                <button type="button" className="btn btn-danger" onClick={() => closeModal('billingInformation')}>Cancel</button>
                <button type="submit" className="btn btn-primary">Continue <i className="fas fa-chevron-right ms-2"></i></button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="orderSummery" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="tosLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="tosLabel">Order Summery</h4>
              <button type="button" className="btn-close" onClick={() => closeModal('orderSummery')} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-end">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ "width": "70%" }}>
                      <h6 className="mb-0 text-uppercase">{selectedPlan.name} Plan</h6>
                    </td>
                    <td className="text-end">₹ {selectedPlan.price_inr}</td>
                  </tr>
                  <tr className="border-bottom">
                    <td colSpan="2" style={{ "width": "70%" }}>
                      <ul>
                        <li>1 Month</li>
                        <li>{selectedPlan.unlock_daily} Daily Unlock</li>
                        <li>{selectedPlan.unlock_month} Monthly Unlock</li>
                        <li>{selectedPlan.download} Downloads</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <td>
                      <h6 className="mb-0 fw-bold">SUBTOTAL</h6>
                    </td>
                    <td className="text-end fw-bold">₹ {selectedPlan.price_inr}</td>
                  </tr>
                  <tr>
                    <td><h6 className="mb-0">CGST 9%</h6></td>
                    <td className="text-end">₹ {selectedPlan.price_inr * 9 / 100}</td>
                  </tr>
                  <tr>
                    <td><h6 className="mb-0">SGST 9%</h6></td>
                    <td className="text-end">₹ {selectedPlan.price_inr * 9 / 100}</td>
                  </tr>
                  <tr className="border-top">
                    <td><h6 className="mb-0 text-primary fw-bold">TOTAL</h6></td>
                    <td className="text-end text-primary fw-bold">₹ {selectedPlan.price_inr + (selectedPlan.price_inr * 9 / 100 * 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              {selectedPlan && <input type="hidden" name="plan_id" value={selectedPlan.plan_id} />}
              <button type="button" className="btn btn-danger" onClick={() => closeModal('orderSummery')}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => displayRazorpay()}>Pay &amp; Subscribe <i className="fas fa-chevron-right ms-2"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" id="modal-backdrop" style={{ "display": "none", "opacity": ".5" }}></div>

    </>
  )
}

export default SubscribePlan
