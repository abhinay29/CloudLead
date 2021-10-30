import React, { useContext, useState } from 'react';
import PeopleState from '../Context/People/PeopleState'
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
import { useDispatch } from 'react-redux';
import { progressLoading } from '../../states/action-creator';
import { NotificationManager } from 'react-notifications';

const API_URL = process.env.REACT_APP_API_URL;

const WatchFilter = (props) => {

  // const loadingState = useSelector(state => state.reducer)
  const dispatch = useDispatch()

  const context = useContext(PeopleContext);
  // const { getPeoples, setTotalPeople, setUniqueComp } = context;
  const { searchWatchList, closeModal } = props
  const [disSearchBtn, setDisSearchBtn] = useState(false)
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
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const handleDepartment = (e) => {

    if (!e.target.checked) {
      setDefaultValue({ ...defaultValue, [e.target.dataset.role]: [] })
    }

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

    const serialize = (data) => {
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

    localStorage.setItem('currentWatchlistQuery', JSON.stringify(serialize(formData)));

    let query = params.toString()

    if (query.length === 0) {
      NotificationManager.error('Please fill at least 1 field');
      setDisSearchBtn(false);
      return
    }

    setDisSearchBtn(true);

    dispatch(progressLoading(30))
    searchWatchList(`&${query}`);
    setDisSearchBtn(false);

  }

  const [savedSearches, setsavedSearches] = useState([])

  const [defaultValue, setDefaultValue] = useState({
    first_name: [],
    last_name: [],
    position: [],
    person_country: [],
    person_state: [],
    person_city: [],
    company_name: [],
    company_country: [],
    company_state: [],
    company_city: [],
    role_finance: [],
    role_hr: [],
    role_marketing: [],
    role_purchase: [],
    role_operation: [],
    role_corporate: [],
    role_it: [],
    role_others: [],
    company_size_range: [],
    revenue_range: [],
    industry: [],
    domain: [],
    keyword: [],
  })

  const handleSelectChange = (inputValue, actionMeta) => {
    setDefaultValue({ ...defaultValue, [actionMeta.name]: inputValue })
  }

  const selectAllCheckbox = (inputName) => {
    let input = document.getElementsByName(inputName);
    for (var i = 0, n = input.length; i < n; i++) {
      input[i].checked = true;
    }
  }

  const selectNoneCheckbox = (inputName) => {
    let input = document.getElementsByName(inputName);
    for (var i = 0, n = input.length; i < n; i++) {
      input[i].checked = false;
    }
  }

  const setDefaultValueGroupFunction = (options, name) => {
    setDefaultValue({ ...defaultValue, [name]: options })
  }

  const createGroup = (groupName, options, name) => {
    return {
      label: (() => {
        return (
          <div>
            <input type="checkbox" className="form-check-input me-2" onClick={(e) => { if (e.target.checked) setDefaultValueGroupFunction(options, name) }} />
            {groupName}
          </div>
        );
      })(),
      options: options,
    };
  };

  let countryOptionsPerson = [
    countryGroup.map(countryGrp => {
      return createGroup(countryGrp.label, countryGrp.options, 'person_country')
    })
  ];

  let countryOptionsCompany = [
    countryGroup.map(countryGrp => {
      return createGroup(countryGrp.label, countryGrp.options, 'company_country')
    })
  ];

  let industryGroupOptions = [
    industryGrpOpt.map(indGrp => {
      return createGroup(indGrp.label, indGrp.options, 'industry')
    })
  ]

  return (

    <form id="search_form" onSubmit={searchPeople}>
      <div className="modal-body">
        <div className="card border-0 shadow-none">
          <div className="card-body">
            <div className="container" style={{ "maxWidth": "992px" }}>
              <div style={{ "height": "calc(100vh - 200px)", "overflowY": "scroll" }} className="p-3">
                <h6 className="fw-bold">Search by Person Name</h6>
                <div className="row mb-3">
                  <div className="col-md-4 col-lg-4 position-relative">
                    <CreatableSelect
                      isClearable
                      defaultValue={[]}
                      value={defaultValue.first_name}
                      name="first_name"
                      noOptionsMessage={({ inputValue }) => "Type to add..."}
                      isMulti
                      onChange={handleSelectChange}
                      className="basic-multi-select"
                      placeholder="First Name"
                    />
                    <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                  </div>
                  <div className="col-md-4 col-lg-4 position-relative">
                    <CreatableSelect
                      defaultValue={[]}
                      name="last_name"
                      value={defaultValue.last_name}
                      noOptionsMessage={({ inputValue }) => ""}
                      isMulti
                      onChange={handleSelectChange}
                      className="basic-multi-select"
                      placeholder="Last Name"
                    />
                    <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                  </div>
                </div>

                <h6 className="fw-bold">Search By Date</h6>
                <div className="row">
                  <div className="col-md-4 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">From</label>
                      <input type="date" name="from" id="" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-4 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">To</label>
                      <input type="date" name="to" id="" className="form-control" />
                    </div>
                  </div>
                </div>

                <div className="d-flex selectAllCheckbox align-items-center mb-2">
                  <h6 className="fw-bold me-3 mb-0">Search By Company Type</h6>
                  <span>Select</span> <span className="selectBtn" onClick={() => { selectAllCheckbox('company_type') }}>All</span> <span>/</span> <span className="selectBtn" onClick={() => { selectNoneCheckbox('company_type') }} >None</span>
                </div>
                <div className="row mb-1">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="company_type" value="India" id="indias-top-1000" />
                      <label className="form-check-label" htmlFor="indias-top-1000">
                        India's Top 1000
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="company_type" value="MNC" id="mnc" />
                      <label className="form-check-label" htmlFor="mnc">
                        MNC
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="company_type" value="Industry Top" id="industry-top" />
                      <label className="form-check-label" htmlFor="industry-top">
                        Industry Leaders
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="company_type" value="SMEs" id="smes" />
                      <label className="form-check-label" htmlFor="smes">
                        SMEs/MSMEs
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="company_type" value="Startups" id="startups" />
                      <label className="form-check-label" htmlFor="startups">
                        Startups
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex selectAllCheckbox align-items-center mb-2">
                  <h6 className="fw-bold me-3 mb-0">Search by Department</h6>
                  <span>Select</span> <span className="selectBtn" onClick={() => { selectAllCheckbox('department') }}>All</span> <span>/</span> <span className="selectBtn" onClick={() => { selectNoneCheckbox('department') }} >None</span>
                </div>
                <div className="row mb-1">

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input department_checkbox" name="department" type="checkbox" value="finance" id="finance" data-role="role_finance" onChange={handleDepartment} />
                      <label className="form-check-label" htmlFor="finance">
                        Finance &amp; Accounts
                      </label>
                    </div>
                    {deptState.finance && <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={defaultValue.role_finance}
                      isMulti
                      onChange={handleSelectChange}
                      name="role_finance"
                      options={departmentRole.finance}
                      className="basic-multi-select"
                      placeholder="Select Role"
                    />}
                  </div>

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input department_checkbox" name="department" type="checkbox" value="human" data-role="role_hr" id="hr" onChange={handleDepartment} />
                      <label className="form-check-label" htmlFor="hr">
                        Human Resources
                      </label>
                    </div>
                    {deptState.human && <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={defaultValue.role_hr}
                      isMulti
                      onChange={handleSelectChange}
                      name="role_hr"
                      options={departmentRole.hr}
                      className="basic-multi-select"
                      placeholder="Select Role"
                    />}
                  </div>

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input department_checkbox" name="department" type="checkbox" value="marketing" data-role="role_marketing" id="sales-marketing" onChange={handleDepartment} />
                      <label className="form-check-label" htmlFor="sales-marketing">
                        Sales &amp; Marketing
                      </label>
                    </div>
                    {deptState.marketing && <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={defaultValue.role_marketing}
                      isMulti
                      onChange={handleSelectChange}
                      name="role_marketing"
                      options={departmentRole.marketing}
                      className="basic-multi-select"
                      placeholder="Select Role"
                    />}
                  </div>

                </div>
                <div className="row mb-1">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input department_checkbox" name="department" type="checkbox" value="purchase" id="purchase" data-role="role_purchase" onChange={handleDepartment} />
                      <label className="form-check-label" htmlFor="purchase">
                        Purchase &amp; Supply Chain
                      </label>
                    </div>
                    {deptState.purchase && <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={defaultValue.role_purchase}
                      isMulti
                      onChange={handleSelectChange}
                      name="role_purchase"
                      options={departmentRole.purchase}
                      className="basic-multi-select"
                      placeholder="Select Role"
                    />}
                  </div>

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input department_checkbox" name="department" type="checkbox" value="operation" id="operation" data-role="role_operation" onChange={handleDepartment} />
                      <label className="form-check-label" htmlFor="operation">
                        Manufacturing Operations
                      </label>
                    </div>
                    {deptState.operation && <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={defaultValue.role_operation}
                      isMulti
                      onChange={handleSelectChange}
                      name="role_operation"
                      options={departmentRole.operation}
                      className="basic-multi-select"
                      placeholder="Select Role"
                    />}
                  </div>

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input department_checkbox" name="department" type="checkbox" value="corporate" id="corporate" data-role="role_corporate" onChange={handleDepartment} />
                      <label className="form-check-label" htmlFor="corporate">
                        Corporate/HQ
                      </label>
                    </div>
                    {deptState.corporate && <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={defaultValue.role_corporate}
                      isMulti
                      onChange={handleSelectChange}
                      name="role_corporate"
                      options={departmentRole.corporate}
                      className="basic-multi-select"
                      placeholder="Select Role"
                    />}
                  </div>

                </div>
                <div className="row mb-3">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input department_checkbox" name="department" type="checkbox" value="it" data-role="role_it" id="it" onChange={handleDepartment} />
                      <label className="form-check-label" htmlFor="it">
                        IT
                      </label>
                    </div>
                    {deptState.it && <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={defaultValue.role_it}
                      isMulti
                      onChange={handleSelectChange}
                      name="role_it"
                      options={departmentRole.it}
                      className="basic-multi-select"
                      placeholder="Select Role"
                    />}
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input department_checkbox" name="department" type="checkbox" value="others" id="other" data-role="role_others" onChange={handleDepartment} />
                      <label className="form-check-label" htmlFor="other">
                        Others
                      </label>
                    </div>
                    {deptState.others && <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      value={defaultValue.role_others}
                      isMulti
                      onChange={handleSelectChange}
                      name="role_others"
                      options={departmentRole.others}
                      className="basic-multi-select"
                      placeholder="Select Role"
                    />}
                  </div>
                </div>

                <div className="d-flex selectAllCheckbox align-items-center mb-2">
                  <h6 className="fw-bold me-3 mb-0">Search by Seniority</h6>
                  <span>Select</span> <span className="selectBtn" onClick={() => { selectAllCheckbox('seniority_level') }}>All</span> <span>/</span> <span className="selectBtn" onClick={() => { selectNoneCheckbox('seniority_level') }} >None</span>
                </div>
                <div className="row mb-1">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input seniority" name="seniority_level" type="checkbox" value="Director" id="director" />
                      <label className="form-check-label" htmlFor="director">
                        Director
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input seniority" name="seniority_level" type="checkbox" value="Owner" id="owner" />
                      <label className="form-check-label" htmlFor="owner">
                        Onwer/Partner
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input seniority" name="seniority_level" type="checkbox" value="Founder" id="founder" />
                      <label className="form-check-Founder" htmlFor="founder">
                        Founder
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-1">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input seniority" name="seniority_level" type="checkbox" value="C Suite" id="csuite" />
                      <label className="form-check-label" htmlFor="csuite">
                        C Suite
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input seniority" name="seniority_level" type="checkbox" value="VP" id="vp" />
                      <label className="form-check-label" htmlFor="vp">
                        VP
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input seniority" name="seniority_level" type="checkbox" value="HOD" id="hod" />
                      <label className="form-check-label" htmlFor="hod">
                        HOD
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input seniority" name="seniority_level" type="checkbox" value="Manager" id="manager" />
                      <label className="form-check-label" htmlFor="manager">
                        Manager
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input className="form-check-input seniority" name="seniority_level" type="checkbox" value="Officer" id="officer" />
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
                      onChange={handleSelectChange}
                      value={defaultValue.position}
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
                      name="person_country"
                      onChange={handleSelectChange}
                      value={defaultValue.person_country}
                      options={countryOptionsPerson[0]}
                      className="basic-multi-select"
                      placeholder="Person's Country"
                      styles={{ "background": "#000" }}
                    />
                  </div>
                  <div className="col-md-4 col-lg-4 position-relative">
                    <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      noOptionsMessage={({ inputValue }) => "Type to search.."}
                      isMulti
                      name="person_state"
                      onChange={handleSelectChange}
                      value={defaultValue.person_state}
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
                      name="person_city"
                      onChange={handleSelectChange}
                      value={defaultValue.person_city}
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
                      name="company_name"
                      onChange={handleSelectChange}
                      value={defaultValue.company_name}
                      noOptionsMessage={({ inputValue }) => "Type to add..."}
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
                      name="company_size_range"
                      onChange={handleSelectChange}
                      value={defaultValue.company_size_range}
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
                      name="revenue_range"
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
                      onChange={handleSelectChange}
                      value={defaultValue.industry}
                      name="industry"
                      options={industryGroupOptions[0]}
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
                      onChange={handleSelectChange}
                      value={defaultValue.company_country}
                      name="company_country"
                      options={countryOptionsCompany[0]}
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
                      name="company_state"
                      options={states}
                      onKeyDown={handleState}
                      onChange={handleSelectChange}
                      value={defaultValue.company_state}
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
                      name="company_city"
                      options={cities}
                      onKeyDown={handleCity}
                      onChange={handleSelectChange}
                      value={defaultValue.company_city}
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
                      name="domain"
                      isMulti
                      onChange={handleSelectChange}
                      value={defaultValue.domain}
                      noOptionsMessage={({ inputValue }) => ""}
                      className="basic-multi-select"
                      placeholder="Domain/Website"
                    />
                    <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                  </div>
                  <div className="col-md-4 col-lg-4 position-relative">
                    <CreatableSelect
                      defaultValue=""
                      name="keyword"
                      isMulti
                      onChange={handleSelectChange}
                      value={defaultValue.keyword}
                      noOptionsMessage={({ inputValue }) => ""}
                      className="basic-multi-select"
                      placeholder="Keyword"
                    />
                    <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer justify-content-center">
        <button type="button" className="btn btn-secondary" onClick={() => closeModal('searchModal')}>Close</button>
        <button type="submit" className="btn btn-primary"><i className="fas fa-filter"></i> Filter</button>
      </div>
    </form >

  )
}

export default WatchFilter;
