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
import { useDispatch } from 'react-redux';
import { progressLoading } from '../../states/action-creator';

const API_URL = process.env.REACT_APP_API_URL;

const Filter = (props) => {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(progressLoading(40))
    setTimeout(() => {
      dispatch(progressLoading(100))
    }, 500);
  }, [dispatch])

  const context = useContext(CompanyContext);
  const { getCompanies, setTotalComp } = context;
  const { showFilter, setShowFilter, setShowTable } = props
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

    localStorage.setItem('currentCompanyQuery', JSON.stringify(serialize(formData)));

    let query = params.toString()

    if (query.length === 0) {
      alert('Please fill at least 1 field');
      setDisSearchBtn(false);
      return
    }

    setDisSearchBtn(true);
    dispatch(progressLoading(40))
    const url = `${API_URL}/api/companies?${query}`;
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    dispatch(progressLoading(60))
    let parsedData = await data.json()
    if (parsedData.status === 'success') {
      if (parsedData.totalResults === 0) {
        alert('No result found');
        setDisSearchBtn(false);
        return
      }
      localStorage.setItem('companySearchQuery', query)
      getCompanies(parsedData)
      setTotalComp(parsedData.totalResults)
      setShowFilter(false)
      setShowTable(true)
    }
    setDisSearchBtn(false);
    dispatch(progressLoading(100))

  }

  const [savedSearches, setsavedSearches] = useState({})

  // eslint-disable-next-line
  useEffect(async () => {
    let savedSearch = await fetch(`${API_URL}/api/user/savedcompanysearch`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    })
    let res = await savedSearch.json()
    if (res.status === 'success') {
      if (res.result === null) { return false }
      const searchData = []
      localStorage.setItem('savedCompanySearches', JSON.stringify(res.result.data))
      let pushSearch = res.result.data.map(src => {
        searchData.push({ value: src._id, label: src.name })
        return true
      })
      if (pushSearch) {
        setsavedSearches(searchData);
      }
    } else {
      setsavedSearches({})
    }
  }, [showFilter])

  const [defaultValue, setDefaultValue] = useState({
    company_name: [],
    company_country: [],
    company_state: [],
    company_city: [],
  })

  const handleSelectChange = (inputValue, actionMeta) => {
    setDefaultValue({ ...defaultValue, [actionMeta.name]: inputValue })
  }

  const onSelectSavedSearch = async (e) => {
    const savedSearches = await JSON.parse(localStorage.getItem("savedCompanySearches"));
    savedSearches.map(svd => {
      if (svd._id === e.value) {

        let company_name = []
        if (svd.query['company_name'] !== "") {
          if (svd.query['company_name'] instanceof Array) {
            svd.query['company_name'].map(v => {
              company_name.push({ value: v, label: v })
              return true;
            })
          } else {
            company_name = [{ value: svd.query['company_name'], label: svd.query['company_name'] }]
          }
        }

        let company_country = []
        if (svd.query['company_country'] !== "") {
          if (svd.query['company_country'] instanceof Array) {
            svd.query['company_country'].map(v => {
              company_country.push({ value: v, label: v })
              return true;
            })
          } else {
            company_country = [{ value: svd.query['company_country'], label: svd.query['company_country'] }]
          }
        }

        let company_state = []
        if (svd.query['company_state'] !== "") {
          if (svd.query['company_state'] instanceof Array) {
            svd.query['company_state'].map(v => {
              company_state.push({ value: v, label: v })
              return true;
            })
          } else {
            company_state = [{ value: svd.query['company_state'], label: svd.query['company_state'] }]
          }
        }

        let company_city = []
        if (svd.query['company_city'] !== "") {
          if (svd.query['company_city'] instanceof Array) {
            svd.query['company_city'].map(v => {
              company_city.push({ value: v, label: v })
              return true;
            })
          } else {
            company_city = [{ value: svd.query['company_city'], label: svd.query['company_city'] }]
          }
        }

        setDefaultValue({
          ...defaultValue,
          company_name: company_name,
          company_country: company_country,
          company_state: company_state,
          company_city: company_city,
        })

        let x = 0;

        if (svd.query['company_type'] !== "") {
          if (svd.query['company_type'] instanceof Array) {
            let company_type = document.getElementsByName('company_type')
            svd.query['company_type'].map(v => {
              for (x = 0; x < company_type.length; x++) {
                if (company_type[x].value === v) {
                  company_type[x].checked = true;
                }
              }
              return true
            })
          }
        } else {
          let company_type = document.getElementsByName('company_type')
          if (company_type) {
            for (x = 0; x < company_type.length; x++) {
              company_type[x].checked = false;
            }
          }
        }

      }
      return true;
    })
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
                    name="company_name"
                    value={defaultValue.company_name}
                    onChange={handleSelectChange}
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
              <span className="dropup">
                <button type="button" className="btn btn-outline-secondary" data-bs-auto-close="false" data-bs-toggle="dropdown" aria-expanded="false">Saved Search</button>
                <div className="dropdown-menu shadow p-3" style={{ "width": "260px" }}>
                  <h6 className="fw-bold">Saved/Recent Searches</h6>
                  <hr />
                  <h6 className="fw-bold">Saved Seaches</h6>
                  <div className="mb-3">
                    <Select
                      defaultValue=""
                      options={savedSearches}
                      onChange={onSelectSavedSearch}
                      className="basic-multi-select"
                      placeholder="Type to search"
                    />
                  </div>
                  <h6 className="fw-bold">Last 5 Searches</h6>
                  <div>
                    <span className="badge bg-success me-1">Search 1</span>
                    <span className="badge bg-success me-1">Search 2</span>
                    <span className="badge bg-success me-1">Search 3</span>
                    <span className="badge bg-success me-1">Search 4</span>
                    <span className="badge bg-success me-1">Search 5</span>
                  </div>
                </div>
              </span>
            </div>
          </form>
        </div>
      </div >
    </div>

  )
}

export default Filter;
