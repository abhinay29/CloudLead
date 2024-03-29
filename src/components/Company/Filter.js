// eslint-disable-next-line
import React, { useContext, useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import "react-select-plus/dist/react-select-plus.css";
import CompanyContext from "../Context/Company/CompanyContext";
import { compSizeRangeOpt, revenueRange } from "../Data/data";
import { industryGrpOpt } from "../Data/industries";
import { countryGroup } from "../Data/countries";
import { useDispatch } from "react-redux";
import { progressLoading } from "../../states/action-creator";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

const Filter = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(progressLoading(40));
    setTimeout(() => {
      dispatch(progressLoading(100));
    }, 500);
  }, [dispatch]);

  const context = useContext(CompanyContext);
  const { getCompanies, setTotalComp } = context;
  const { showFilter, setShowFilter, setShowTable } = props;
  const [disSearchBtn, setDisSearchBtn] = useState(false);

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);

  const handleCity = async (e) => {
    let query = e.target.value;
    if (!query || query.length < 3) {
      setCities([]);
      return;
    } else {
      let url = `${API_URL}/api/cities/` + query;
      const response = await fetch(url);
      const cityRes = await response.json();
      setCities(cityRes);
    }
  };

  const handleState = async (e) => {
    let query = e.target.value;
    if (!query || query.length < 3) {
      setStates([]);
      return;
    } else {
      let url = `${API_URL}/api/states/` + query;
      const response = await fetch(url);
      const stateRes = await response.json();
      setStates(stateRes);
    }
  };

  let timer;

  const getCompanySuggestions = async (e) => {
    let query = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(fetchCompSuggestions(query), 1000);
  };

  const fetchCompSuggestions = async (q) => {
    if (!q || q.length < 3) {
      setCompanySuggestions([]);
      return;
    } else {
      let url = `${API_URL}/api/companies/suggestions/` + q;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        setCompanySuggestions(data.companies);
      }
    }
  };

  const searchCompany = async (e) => {
    e.preventDefault();
    let form = document.getElementById("search_form");
    let formData = new FormData(form);
    let params = new URLSearchParams(formData);
    let keysForDel = [];
    params.forEach((v, k) => {
      if (v === "") keysForDel.push(k);
    });
    keysForDel.forEach((k) => {
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
    };

    localStorage.setItem(
      "currentCompanyQuery",
      JSON.stringify(serialize(formData))
    );

    let query = params.toString();

    if (query.length === 0) {
      alert("Please fill at least 1 field");
      setDisSearchBtn(false);
      return;
    }

    setDisSearchBtn(true);
    dispatch(progressLoading(40));
    const url = `${API_URL}/api/companies?${query}`;
    let data = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    dispatch(progressLoading(60));
    let parsedData = await data.json();
    if (parsedData.status === "success") {
      if (parsedData.totalResults === 0) {
        toast.error("No result found");
        setDisSearchBtn(false);
        return;
      }
      localStorage.setItem("companySearchQuery", query);
      getCompanies(parsedData);
      setTotalComp(parsedData.totalResults);
      setShowFilter(false);
      setShowTable(true);
    }
    setDisSearchBtn(false);
    dispatch(progressLoading(100));
  };

  const [savedSearches, setsavedSearches] = useState({});

  // eslint-disable-next-line
  useEffect(async () => {
    let savedSearch = await fetch(`${API_URL}/api/user/savedcompanysearch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });
    let res = await savedSearch.json();
    if (res.status === "success") {
      if (res.result === null) {
        return false;
      }
      const searchData = [];
      localStorage.setItem(
        "savedCompanySearches",
        JSON.stringify(res.result.data)
      );
      let pushSearch = res.result.data.map((src) => {
        searchData.push({ value: src._id, label: src.name });
        return true;
      });
      if (pushSearch) {
        setsavedSearches(searchData);
      }
    } else {
      setsavedSearches({});
    }
  }, [showFilter]);

  const initialDefaultValue = {
    company_name: [],
    company_country: [],
    company_state: [],
    company_city: [],
    industry: [],
    revenue_range: [],
    company_size_range: []
  };

  const [defaultValue, setDefaultValue] = useState(initialDefaultValue);

  const handleSelectChange = (inputValue, actionMeta) => {
    setDefaultValue({ ...defaultValue, [actionMeta.name]: inputValue });
  };

  const onSelectSavedSearch = async (e) => {
    const savedSearches = await JSON.parse(
      localStorage.getItem("savedCompanySearches")
    );
    savedSearches.map((svd) => {
      if (svd._id === e.value) {
        let company_name = [];
        if (svd.query["company_name"] !== "") {
          if (svd.query["company_name"] instanceof Array) {
            svd.query["company_name"].map((v) => {
              company_name.push({ value: v, label: v });
              return true;
            });
          } else {
            company_name = [
              {
                value: svd.query["company_name"],
                label: svd.query["company_name"]
              }
            ];
          }
        }

        let company_country = [];
        if (svd.query["company_country"] !== "") {
          if (svd.query["company_country"] instanceof Array) {
            svd.query["company_country"].map((v) => {
              company_country.push({ value: v, label: v });
              return true;
            });
          } else {
            company_country = [
              {
                value: svd.query["company_country"],
                label: svd.query["company_country"]
              }
            ];
          }
        }

        let company_state = [];
        if (svd.query["company_state"] !== "") {
          if (svd.query["company_state"] instanceof Array) {
            svd.query["company_state"].map((v) => {
              company_state.push({ value: v, label: v });
              return true;
            });
          } else {
            company_state = [
              {
                value: svd.query["company_state"],
                label: svd.query["company_state"]
              }
            ];
          }
        }

        let company_city = [];
        if (svd.query["company_city"] !== "") {
          if (svd.query["company_city"] instanceof Array) {
            svd.query["company_city"].map((v) => {
              company_city.push({ value: v, label: v });
              return true;
            });
          } else {
            company_city = [
              {
                value: svd.query["company_city"],
                label: svd.query["company_city"]
              }
            ];
          }
        }

        setDefaultValue({
          ...defaultValue,
          company_name: company_name,
          company_country: company_country,
          company_state: company_state,
          company_city: company_city
        });

        let x = 0;

        if (svd.query["company_type"] !== "") {
          if (svd.query["company_type"] instanceof Array) {
            let company_type = document.getElementsByName("company_type");
            svd.query["company_type"].map((v) => {
              for (x = 0; x < company_type.length; x++) {
                if (company_type[x].value === v) {
                  company_type[x].checked = true;
                }
              }
              return true;
            });
          }
        } else {
          let company_type = document.getElementsByName("company_type");
          if (company_type) {
            for (x = 0; x < company_type.length; x++) {
              company_type[x].checked = false;
            }
          }
        }
      }
      return true;
    });
  };

  const selectAllCheckbox = (inputName) => {
    let input = document.getElementsByName(inputName);
    for (var i = 0, n = input.length; i < n; i++) {
      input[i].checked = true;
    }
  };

  const selectNoneCheckbox = (inputName) => {
    let input = document.getElementsByName(inputName);
    for (var i = 0, n = input.length; i < n; i++) {
      input[i].checked = false;
    }
  };

  // const setDefaultValueGroupFunction = (options, name) => {
  //   setDefaultValue({ ...defaultValue, [name]: options });
  // };

  // const createGroup = (groupName, options, name) => {
  //   return {
  //     label: (() => {
  //       return (
  //         <div>
  //           <input
  //             type="checkbox"
  //             className="form-check-input me-2"
  //             onClick={(e) => {
  //               if (e.target.checked)
  //                 setDefaultValueGroupFunction(options, name);
  //             }}
  //           />
  //           {groupName}
  //         </div>
  //       );
  //     })(),
  //     options: options
  //   };
  // };

  const setDefaultValueGroupFunction = (options, name) => {
    var opt = [];

    if (name === "country") {
      if (defaultValue.country.length > 0) {
        opt = defaultValue.country;
        options.map((o) => {
          return opt.push(o);
        });
      } else {
        opt = options;
      }
    } else if (name === "industry") {
      if (defaultValue.industry.length > 0) {
        opt = defaultValue.industry;
        options.map((o) => {
          return opt.push(o);
        });
      } else {
        opt = options;
      }
    } else if (name === "company_country") {
      if (defaultValue.company_country.length > 0) {
        opt = defaultValue.company_country;
        options.map((o) => {
          return opt.push(o);
        });
      } else {
        opt = options;
      }
    }

    setDefaultValue({ ...defaultValue, [name]: opt });
  };

  const createGroup = (groupName, options, name) => {
    // if (name === "industry") {

    // }
    return {
      label: (() => {
        return (
          <div>
            <input
              type="checkbox"
              className="form-check-input me-2"
              onClick={(e) => {
                if (e.target.checked)
                  setDefaultValueGroupFunction(options, name);
              }}
            />
            <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
              {groupName}
            </span>
          </div>
        );
      })(),
      options: (() => {
        var opt = [];
        options.map((option) => {
          var optPush = {
            label: (() => {
              return (
                <>
                  <input
                    type="checkbox"
                    className="form-check-input mx-2 small "
                  />
                  {option.label}
                </>
              );
            })(),
            value: option.value
          };
          opt.push(optPush);
          return false;
        });
        return opt;
      })()
    };
  };

  let countryOptionsCompany = [
    countryGroup.map((countryGrp) => {
      return createGroup(
        countryGrp.label,
        countryGrp.options,
        "company_country"
      );
    })
  ];

  let industryGroupOptions = [
    industryGrpOpt.map((indGrp) => {
      return createGroup(indGrp.label, indGrp.options, "industry");
    })
  ];

  return (
    <div
      className="card border-0 shadow-none"
      style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}
    >
      <div className="card-body">
        <h4 className="fw-lighter text-center mb-2">
          Search Potential Companies.
        </h4>
        <div className="container mt-3" style={{ maxWidth: "992px" }}>
          <form id="search_form" onSubmit={searchCompany}>
            <div
              style={{ height: "calc(100vh - 240px)", overflowY: "scroll" }}
              className="p-3"
            >
              <div className="d-flex selectAllCheckbox align-items-center mb-2">
                <h6 className="fw-bold me-2 mb-0">Search By Company Type</h6>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Applies only for India</Tooltip>}
                >
                  <i className="fas fa-info-circle me-2"></i>
                </OverlayTrigger>
                <span>Select</span>{" "}
                <span
                  className="selectBtn"
                  onClick={() => {
                    selectAllCheckbox("company_type");
                  }}
                >
                  All
                </span>{" "}
                <span>/</span>{" "}
                <span
                  className="selectBtn"
                  onClick={() => {
                    selectNoneCheckbox("company_type");
                  }}
                >
                  None
                </span>
              </div>
              <div className="row mb-1">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="company_type"
                      value="India"
                      id="indias-top-1000"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="indias-top-1000"
                    >
                      India's Top 1000
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            Companies with highest turnover/employee head
                            count/brand equity etc.
                          </Tooltip>
                        }
                      >
                        <i className="fas fa-info-circle ms-2"></i>
                      </OverlayTrigger>
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="company_type"
                      value="MNC"
                      id="mnc"
                    />
                    <label className="form-check-label" htmlFor="mnc">
                      MNC
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            Overseas companies having presence in India
                          </Tooltip>
                        }
                      >
                        <i className="fas fa-info-circle ms-2"></i>
                      </OverlayTrigger>
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="company_type"
                      value="Industry Top"
                      id="industry-top"
                    />
                    <label className="form-check-label" htmlFor="industry-top">
                      Industry Leaders
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            Best companies according to our research in each
                            sector
                          </Tooltip>
                        }
                      >
                        <i className="fas fa-info-circle ms-2"></i>
                      </OverlayTrigger>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="company_type"
                      value="SMEs"
                      id="smes"
                    />
                    <label className="form-check-label" htmlFor="smes">
                      SMEs/MSMEs
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            Mostly Companies with less than 20 Cr turn over
                            (Product), &amp; 5 Cr turnover (Services)
                          </Tooltip>
                        }
                      >
                        <i className="fas fa-info-circle ms-2"></i>
                      </OverlayTrigger>
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="company_type"
                      value="Startups"
                      id="startups"
                    />
                    <label className="form-check-label" htmlFor="startups">
                      Startups
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            New, Young organizations, generally on tech
                            /E-commerce platform belonging to any industry
                            sector
                          </Tooltip>
                        }
                      >
                        <i className="fas fa-info-circle ms-2"></i>
                      </OverlayTrigger>
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
                    closeMenuOnSelect={false}
                    onChange={handleSelectChange}
                    onKeyDown={getCompanySuggestions}
                    value={defaultValue.company_name}
                    options={companySuggestions}
                    noOptionsMessage={({ inputValue }) => "Type to search..."}
                    isMulti
                    className="basic-multi-select"
                    placeholder="Company Name"
                    createOptionPosition="first"
                  />
                  <p style={{ fontSize: "12px" }} className="mb-0 mt-1">
                    Use tab/enter for multi selection.
                  </p>
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="company_size_range"
                    options={compSizeRangeOpt}
                    className="basic-multi-select"
                    placeholder="Select Company Size"
                    onChange={handleSelectChange}
                    value={defaultValue.company_size_range}
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
                    placeholder="Select Revenue Range"
                    onChange={handleSelectChange}
                    value={defaultValue.revenue_range}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    isMulti
                    closeMenuOnSelect={false}
                    name="industry"
                    onChange={handleSelectChange}
                    value={defaultValue.industry}
                    options={industryGroupOptions[0]}
                    className="basic-multi-select"
                    placeholder="Select Industry"
                  />
                </div>
              </div>

              <h6 className="fw-bold">Search by Company Location</h6>
              <div className="row mb-3">
                <div className="col-md-4 col-lg-4 position-relative">
                  <CreatableSelect
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    options={countryOptionsCompany[0]}
                    name="company_country"
                    className="basic-multi-select"
                    placeholder="Comapany's Country"
                    onChange={handleSelectChange}
                    value={defaultValue.company_country}
                  />
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="company_state"
                    options={states}
                    onKeyDown={handleState}
                    className="basic-multi-select"
                    placeholder="Comapany's State"
                    onChange={handleSelectChange}
                    value={defaultValue.company_state}
                  />
                </div>
                <div className="col-md-4 col-lg-4 position-relative">
                  <Select
                    defaultValue={[]}
                    closeMenuOnSelect={false}
                    isMulti
                    name="company_city"
                    options={cities}
                    onKeyDown={handleCity}
                    className="basic-multi-select"
                    placeholder="Comapany's City"
                    onChange={handleSelectChange}
                    value={defaultValue.company_city}
                  />
                </div>
              </div>

              <div className="d-flex">
                <h6 className="fw-bold">Search by Website & Keywords</h6>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>
                      Please enter a specific product/service/solution you wish
                      to search.
                    </Tooltip>
                  }
                >
                  <i className="fas fa-info-circle ms-2"></i>
                </OverlayTrigger>
              </div>
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
                  <p style={{ fontSize: "12px" }} className="mb-0 mt-1">
                    Use tab/enter for multi selection.
                  </p>
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
                  <p style={{ fontSize: "12px" }} className="mb-0 mt-1">
                    Use tab/enter for multi selection.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="d-flex justify-content-center align-items-center position-absolute py-4 border-top"
              style={{
                bottom: "0",
                left: "0",
                right: "0",
                background: "#fff",
                width: "100%",
                zIndex: "10"
              }}
            >
              <button
                type="reset"
                id="reset_search"
                onClick={() => {
                  setDefaultValue(initialDefaultValue);
                }}
                className="btn btn-secondary"
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary mx-3"
                id="search_btn"
                disabled={disSearchBtn && "disabled"}
              >
                Search
              </button>
              <span className="dropup">
                <button
                  type="button"
                  className="btn btn-warning"
                  data-bs-auto-close="false"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Saved Search
                </button>
                <div
                  className="dropdown-menu shadow p-3"
                  style={{ width: "260px" }}
                >
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
                  {/* <h6 className="fw-bold">Last 5 Searches</h6>
                  <div>
                    <span className="badge bg-success me-1">Search 1</span>
                    <span className="badge bg-success me-1">Search 2</span>
                    <span className="badge bg-success me-1">Search 3</span>
                    <span className="badge bg-success me-1">Search 4</span>
                    <span className="badge bg-success me-1">Search 5</span>
                  </div> */}
                </div>
              </span>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    The company added by you are moved to watchlist.
                  </Tooltip>
                }
              >
                <Link
                  to="/radar/company/watchlist"
                  className="btn btn-success ms-3"
                >
                  <i className="fas fa-bookmark"></i> Watchlist
                </Link>
              </OverlayTrigger>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Filter;
