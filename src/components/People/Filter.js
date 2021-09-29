import React, { useContext, useEffect, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from "react-select";
import PeopleContext from '../Context/People/PeopleContext';
import {
  positionOptions,
  departmentRole,
  compSizeRangeOpt,
  revenueRange,
} from "../Data/data";
import { industryGrpOpt } from "../Data/industries"
import { countryGroup } from "../Data/countries"

const API_URL = process.env.REACT_APP_API_URL;

const Filter = (props) => {

  const context = useContext(PeopleContext);
  const { getPeoples, totalPeople, setTotalPeople, setUniqueComp } = context;
  const [formValue, setFormValue] = useState({ first_name: [] })
  const { setShowFilter, setShowTable } = props


  // const [limit, setLimit] = useState("")
  const [disSearchBtn, setDisSearchBtn] = useState(false)
  // const ref = useRef(null)
  // const refClose = useRef(null)
  // const { resetRole, setResetRole } = props;

  const [deptState, setdeptState] = useState({
    finance: false,
    human: false,
    marketing: false,
    purchase: false,
    operation: false,
    corporate: false,
    others: false,
    it: false,
  })

  const handleFormValue = (e) => {
    var obj = [];
    obj.push([e.target.value]);
    setFormValue({ ...formValue, [e.target.name]: obj })
  }

  console.log(formValue)

  if (localStorage.getItem('savedQuery')) {
    var test = localStorage.getItem('savedQuery');
    console.log(test);
  }

  const handleDepartment = (e) => {

    if (!e.target.value) {
      return false;
    }
    const deptSelect = deptState[e.target.value];
    if (deptSelect) {
      setdeptState({ ...deptState, [e.target.value]: false })
    } else {
      setdeptState({ ...deptState, [e.target.value]: true })
    }
  }

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const handleCity = async (e) => {
    let query = e.target.value;
    if (!query || query.length < 3) {
      setCities([])
      return
    } else {
      let url = `${API_URL}/api/cities/` + query;
      const response = await fetch(url)
      const cityRes = await response.json();
      setCities(cityRes);
    }
  }

  const handleState = async (e) => {
    let query = e.target.value;
    if (!query || query.length < 3) {
      setStates([])
      return
    } else {
      let url = `${API_URL}/api/states/` + query;
      const response = await fetch(url)
      const stateRes = await response.json();
      setStates(stateRes);
    }
  }

  const searchPeople = async (e) => {
    e.preventDefault()
    let form = document.getElementById('search_form');
    let formData = new FormData(form)
    let params = new URLSearchParams(formData);
    let keysForDel = [];
    params.forEach((v, k) => {
      if (v === '')
        keysForDel.push(k);
    });
    keysForDel.forEach(k => {
      params.delete(k);
    });

    function serialize(data) {
      let obj = {};
      for (let [key, value] of data) {
        if (obj[key] !== undefined) {
          if (!Array.isArray(obj[key])) {
            obj[key] = [obj[key]];
          }
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      }
      return obj;
    }

    localStorage.setItem('savedQuery', serialize(formData));

    let query = params.toString()

    if (query.length === 0) {
      alert('Please fill at least 1 field');
      setDisSearchBtn(false);
      return
    }

    setDisSearchBtn(true);

    const url = `${API_URL}/api/contacts?${query}`;
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
    });
    let parsedData = await data.json()
    if (parsedData.status === 'success') {
      if (parsedData.totalResults === 0) {
        alert('No result found');
        setDisSearchBtn(false);
        return
      }
      localStorage.setItem('searchQuery', query);
      getPeoples(parsedData)
      setTotalPeople(parsedData.totalResults)
      setUniqueComp(parsedData.uniqueCompany)
      setShowFilter(false)
      setShowTable(true)
    }
    setDisSearchBtn(false);

  }

  return (

    <div className="card border-0 shadow-none" style={{ "height": "calc(100vh - 56px)", "overflow": "hidden" }}>
      <div className="card-body">
        <h4 className="fw-lighter text-center mb-2">Search Potential Contacts.</h4>
        <div className="container mt-3" style={{ "maxWidth": "992px" }}>
          <form id="search_form" onSubmit={searchPeople}>
            <div style={{ "height": "calc(100vh - 240px)", "overflowY": "scroll" }} className="p-3">
              <h6 className="fw-bold">Search by Person Name</h6>
              <div className="row mb-3">
                <div className="col-md-4 col-lg-4 position-relative">
                  <CreatableSelect
                    defaultValue={[]}
                    name="first_name[]"
                    noOptionsMessage={({ inputValue }) => ""}
                    value={formValue.first_name}
                    isMulti
                    onChange={handleFormValue}
                    className="basic-multi-select"
                    placeholder="First Name"
                  />
                  <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <CreatableSelect
                    defaultValue={[]}
                    name="last_name[]"
                    noOptionsMessage={({ inputValue }) => ""}
                    isMulti
                    className="basic-multi-select"
                    placeholder="Last Name"
                  />
                  <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                </div>
              </div>

              <h6 className="fw-bold">Search By Company Type</h6>
              <div className="row mb-1">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="company_type[]" value="India" id="indias-top-1000" />
                    <label className="form-check-label" htmlFor="indias-top-1000">
                      India's Top 1000
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="company_type[]" value="MNC" id="mnc" />
                    <label className="form-check-label" htmlFor="mnc">
                      MNC
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="company_type[]" value="Industry Top" id="industry-top" />
                    <label className="form-check-label" htmlFor="industry-top">
                      Industry Leaders
                    </label>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="company_type[]" value="SMEs" id="smes" />
                    <label className="form-check-label" htmlFor="smes">
                      SMEs/MSMEs
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="company_type[]" value="Startups" id="startups" />
                    <label className="form-check-label" htmlFor="startups">
                      Startups
                    </label>
                  </div>
                </div>
              </div>

              <h6 className="fw-bold">Search by Department</h6>
              <div className="row mb-1">

                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input department_checkbox" name="department[]" type="checkbox" value="finance" id="finance" onChange={handleDepartment} />
                    <label className="form-check-label" htmlFor="finance">
                      Finance &amp; Accounts
                    </label>
                  </div>
                  {deptState.finance && <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="role[]"
                    options={departmentRole.finance}
                    className="basic-multi-select"
                    placeholder="Select Role"
                  />}
                </div>

                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input department_checkbox" name="department[]" type="checkbox" value="human" id="hr" onChange={handleDepartment} />
                    <label className="form-check-label" htmlFor="hr">
                      Human Resources
                    </label>
                  </div>
                  {deptState.human && <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="role[]"
                    options={departmentRole.hr}
                    className="basic-multi-select"
                    placeholder="Select Role"
                  />}
                </div>

                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input department_checkbox" name="department[]" type="checkbox" value="marketing" id="sales-marketing" onChange={handleDepartment} />
                    <label className="form-check-label" htmlFor="sales-marketing">
                      Sales &amp; Marketing
                    </label>
                  </div>
                  {deptState.marketing && <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="role[]"
                    options={departmentRole.marketing}
                    className="basic-multi-select"
                    placeholder="Select Role"
                  />}
                </div>

              </div>
              <div className="row mb-1">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input department_checkbox" name="department[]" type="checkbox" value="purchase" id="purchase" onChange={handleDepartment} />
                    <label className="form-check-label" htmlFor="purchase">
                      Purchase &amp; Supply Chain
                    </label>
                  </div>
                  {deptState.purchase && <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="role[]"
                    options={departmentRole.purchase}
                    className="basic-multi-select"
                    placeholder="Select Role"
                  />}
                </div>

                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input department_checkbox" name="department[]" type="checkbox" value="operation" id="operation" onChange={handleDepartment} />
                    <label className="form-check-label" htmlFor="operation">
                      Manufacturing Operations
                    </label>
                  </div>
                  {deptState.operation && <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="role[]"
                    options={departmentRole.operation}
                    className="basic-multi-select"
                    placeholder="Select Role"
                  />}
                </div>

                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input department_checkbox" name="department[]" type="checkbox" value="corporate" id="corporate" onChange={handleDepartment} />
                    <label className="form-check-label" htmlFor="corporate">
                      Corporate/HQ
                    </label>
                  </div>
                  {deptState.corporate && <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="role[]"
                    options={departmentRole.corporate}
                    className="basic-multi-select"
                    placeholder="Select Role"
                  />}
                </div>

              </div>
              <div className="row mb-3">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input department_checkbox" name="department[]" type="checkbox" value="it" id="it" onChange={handleDepartment} />
                    <label className="form-check-label" htmlFor="it">
                      IT
                    </label>
                  </div>
                  {deptState.it && <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="role[]"
                    options={departmentRole.it}
                    className="basic-multi-select"
                    placeholder="Select Role"
                  />}
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input department_checkbox" name="department[]" type="checkbox" value="others" id="other" onChange={handleDepartment} />
                    <label className="form-check-label" htmlFor="other">
                      Others
                    </label>
                  </div>
                  {deptState.others && <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="role[]"
                    options={departmentRole.others}
                    className="basic-multi-select"
                    placeholder="Select Role"
                  />}
                </div>
              </div>

              <h6 className="fw-bold">Search by Seniority</h6>
              <div className="row mb-1">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input seniority" name="seniority_level[]" type="checkbox" value="Director" id="director" />
                    <label className="form-check-label" htmlFor="director">
                      Director
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input seniority" name="seniority_level[]" type="checkbox" value="Owner" id="owner" />
                    <label className="form-check-label" htmlFor="owner">
                      Onwer/Partner
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input seniority" name="seniority_level[]" type="checkbox" value="Founder" id="founder" />
                    <label className="form-check-Founder" htmlFor="founder">
                      Founder
                    </label>
                  </div>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input seniority" name="seniority_level[]" type="checkbox" value="C Suite" id="csuite" />
                    <label className="form-check-label" htmlFor="csuite">
                      C Suite
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input seniority" name="seniority_level[]" type="checkbox" value="VP" id="vp" />
                    <label className="form-check-label" htmlFor="vp">
                      VP
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input seniority" name="seniority_level[]" type="checkbox" value="HOD" id="hod" />
                    <label className="form-check-label" htmlFor="hod">
                      HOD
                    </label>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input seniority" name="seniority_level[]" type="checkbox" value="Manager" id="manager" />
                    <label className="form-check-label" htmlFor="manager">
                      Manager
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input className="form-check-input seniority" name="seniority_level[]" type="checkbox" value="Officer" id="officer" />
                    <label className="form-check-label" htmlFor="officer">
                      Officer
                    </label>
                  </div>
                </div>
              </div>

              <h6 className="fw-bold">Search by Title</h6>
              <div className="row mb-3">
                <div className="col-md-4 col-lg-4">
                  <CreatableSelect
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="position"
                    options={positionOptions}
                    className="basic-multi-select"
                    placeholder="Select Title"
                  />
                </div>
              </div>

              <h6 className="fw-bold">Search by Person's Location</h6>
              <div className="row mb-3">
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="person_country[]"
                    options={countryGroup}
                    className="basic-multi-select"
                    placeholder="Person's Country"
                  />
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    noOptionsMessage={({ inputValue }) => "Type to search.."}
                    isMulti
                    name="person_state[]"
                    options={states}
                    onKeyDown={handleState}
                    className="basic-multi-select"
                    placeholder="Person's State"
                  />
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    noOptionsMessage={({ inputValue }) => "Type to search.."}
                    isMulti
                    name="person_city[]"
                    options={cities}
                    onKeyDown={handleCity}
                    className="basic-multi-select"
                    placeholder="Person's City"
                  />
                </div>
              </div>
              <h6 className="fw-bold">Search by Company</h6>
              <div className="row mb-3">
                <div className="col-md-4 col-lg-4 position-relative">
                  <CreatableSelect
                    defaultValue={[]}
                    name="company_name[]"
                    noOptionsMessage={({ inputValue }) => ""}
                    isMulti
                    className="basic-multi-select"
                    placeholder="Company Name"
                  />
                  <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="company_size_range[]"
                    options={compSizeRangeOpt}
                    className="basic-multi-select"
                    placeholder="Select Company Size"
                  />
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="revenue_range[]"
                    options={revenueRange}
                    className="basic-multi-select"
                    placeholder="Select Company Size"
                  />
                </div>
              </div>

              <div className="row mb-3">

                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    isMulti
                    closeMenuOnSelect={false}
                    name="industry[]"
                    options={industryGrpOpt}
                    className="basic-multi-select"
                    placeholder="Select Industry"
                  />
                </div>

              </div>

              <h6 className="fw-bold">Search by Company Location</h6>
              <div className="row mb-3">
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="company_country[]"
                    options={countryGroup}
                    className="basic-multi-select"
                    placeholder="Comapany's Country"
                  />
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    noOptionsMessage={({ inputValue }) => "Type to search.."}
                    isMulti
                    name="company_state[]"
                    options={states}
                    onKeyDown={handleState}
                    className="basic-multi-select"
                    placeholder="Comapany's State"
                  />
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    noOptionsMessage={({ inputValue }) => "Type to search.."}
                    isMulti
                    name="company_city[]"
                    options={cities}
                    onKeyDown={handleCity}
                    className="basic-multi-select"
                    placeholder="Comapany's City"
                  />
                </div>
              </div>

              <h6 className="fw-bold">Search by Website & Keywords</h6>
              <div className="row">
                <div className="col-md-4 col-lg-4 position-relative">
                  <CreatableSelect
                    defaultValue=""
                    name="domain[]"
                    isMulti
                    noOptionsMessage={({ inputValue }) => ""}
                    className="basic-multi-select"
                    placeholder="Domain/Website"
                  />
                  <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <CreatableSelect
                    defaultValue=""
                    name="keyword[]"
                    isMulti
                    noOptionsMessage={({ inputValue }) => ""}
                    className="basic-multi-select"
                    placeholder="Keyword"
                  />
                  <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                </div>
              </div>
            </div>

            <div
              className="d-flex justify-content-center position-absolute py-4 border-top"
              style={{ "bottom": "0", "left": "0", "right": "0", "background": "#fff", "width": "100%", "zIndex": "10" }}>
              <button type="reset" id="reset_search" onClick={() => { window.location.reload(false); }} className="btn btn-outline-secondary">Reset</button>
              <button type="submit" className="btn btn-primary mx-3" id="search_btn" style={{ "width": "160px" }} disabled={disSearchBtn && "disabled"} >Run Search Query</button>
              <button type="button" className="btn btn-outline-secondary">Saved Search</button>
            </div>
          </form>
        </div>
      </div >
    </div>

  )
}

export default Filter;
