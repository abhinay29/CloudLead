// eslint-disable-next-line
import React, { useContext, useEffect, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from "react-select";
import 'react-select-plus/dist/react-select-plus.css';
import CompanyContext from '../Context/Company/CompanyContext';
import {
  compSizeRangeOpt,
  revenueRange,
} from "../Data/data";
import { industryGrpOpt } from "../Data/industries"
import { countryGroup } from "../Data/countries"

const API_URL = process.env.REACT_APP_API_URL;

const Filter = (props) => {

  const context = useContext(CompanyContext);
  const { companies, getCompanies, totalComapany, setTotalComp } = context;
  const { setShowFilter, setShowTable } = props
  const [disSearchBtn, setDisSearchBtn] = useState(false)

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

  const searchCompany = async (e) => {
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

    let query = params.toString()

    if (query.length === 0) {
      alert('Please fill at least 1 field');
      setDisSearchBtn(false);
      return
    }

    setDisSearchBtn(true);

    const url = `${API_URL}/api/companies?${query}`;
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    let parsedData = await data.json()
    if (parsedData.status === 'success') {
      if (parsedData.totalResults === 0) {
        alert('No result found');
        setDisSearchBtn(false);
        return
      }
      localStorage.setItem('searchQuery', query)
      getCompanies(parsedData)
      setTotalComp(parsedData.totalResults)
      setShowFilter(false)
      setShowTable(true)
    }
    setDisSearchBtn(false);

  }

  return (

    <div className="card border-0 shadow-none" style={{ "height": "calc(100vh - 56px)", "overflow": "hidden" }}>
      <div className="card-body">
        <h4 className="fw-lighter text-center mb-2">Search Potential Companies.</h4>
        <div className="container mt-3" style={{ "maxWidth": "992px" }}>
          <form id="search_form" onSubmit={searchCompany}>
            <div style={{ "height": "calc(100vh - 240px)", "overflowY": "scroll" }} className="p-3">

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

                <div className="col-md-4 col-lg-4 position-relative">
                  <CreatableSelect
                    defaultValue={[]}
                    name="services[]"
                    isMulti
                    noOptionsMessage={({ inputValue }) => ""}
                    className="basic-multi-select"
                    placeholder="Product/Services"
                  />
                  <p style={{ "fontSize": "12px" }} className="mb-0 mt-1">Use tab/enter for multi selection.</p>
                </div>
              </div>

              <h6 className="fw-bold">Search by Company Location</h6>
              <div className="row mb-3">
                <div className="col-md-4 col-lg-4 position-relative">
                  <CreatableSelect
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    options={countryGroup}
                    name="company_country[]"
                    className="basic-multi-select"
                    placeholder="Comapany's Country"
                  />
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
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
            </div>
          </form>
        </div>
      </div >
    </div>

  )
}

export default Filter;
