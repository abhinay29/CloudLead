import React, { useContext, useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import PeopleContext from "../Context/People/PeopleContext";
import {
  titleOptions,
  departmentRole,
  compSizeRangeOpt,
  revenueRange
} from "../Data/data";
import { industryGrpOpt } from "../Data/industries";
import { countryGroup } from "../Data/countries";
import { useDispatch } from "react-redux";
import {
  progressLoading,
  setPeopleSearchResults
} from "../../states/action-creator";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const Filter = (props) => {
  // const loadingState = useSelector(state => state.reducer)
  const dispatch = useDispatch();

  const context = useContext(PeopleContext);
  const { getPeoples, setTotalPeople, setUniqueComp, setSkeletonLoading } =
    context;
  const { showFilter, setShowFilter, setShowTable } = props;
  const [disSearchBtn, setDisSearchBtn] = useState(false);
  const [deptState, setdeptState] = useState({
    finance: false,
    human: false,
    marketing: false,
    purchase: false,
    operation: false,
    corporate: false,
    others: false,
    it: false
  });
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);

  const handleDepartment = (e) => {
    if (!e.target.checked) {
      setDefaultValue({ ...defaultValue, [e.target.dataset.role]: [] });
    }

    if (!e.target.value) {
      return false;
    }
    const deptSelect = deptState[e.target.value];
    if (deptSelect && !e.target.checked) {
      setdeptState({ ...deptState, [e.target.value]: false });
    } else {
      setdeptState({ ...deptState, [e.target.value]: true });
    }
  };

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

  const getCompanySuggestions = async (e) => {
    let query = e.target.value;
    if (!query || query.length < 3) {
      setCompanySuggestions([]);
      return;
    } else {
      let url = `${API_URL}/api/companies/suggestions/` + query;
      const response = await fetch(url);
      const compSuggRes = await response.json();
      if (compSuggRes.status === "success") {
        setCompanySuggestions(compSuggRes.companies);
      }
    }
  };

  if (localStorage.getItem("searchQuery")) {
    setShowFilter(false);
    setShowTable(true);
  }

  const searchPeople = async (e) => {
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

    localStorage.setItem("currentQuery", JSON.stringify(serialize(formData)));

    let query = params.toString();

    if (query.length === 0) {
      toast.error("Please fill at least 1 field");
      setDisSearchBtn(false);
      return;
    }

    setDisSearchBtn(true);

    dispatch(progressLoading(30));
    try {
      const url = `${API_URL}/api/contacts?${query}`;
      let data = await fetch(url, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      });
      let parsedData = await data.json();
      if (parsedData.status === "success") {
        if (parsedData.totalResults === 0) {
          dispatch(progressLoading(100));
          toast.error("No result found");
          setDisSearchBtn(false);
          return;
        }
        localStorage.setItem("searchQuery", query);
        setShowFilter(false);
        getPeoples(parsedData);
        setTotalPeople(parsedData.totalResults);
        setUniqueComp(parsedData.uniqueCompany);
        setShowTable(true);
        setSkeletonLoading(false);
        dispatch(progressLoading(100));
        dispatch(setPeopleSearchResults(parsedData));
      } else if (parsedData.status === "error") {
        dispatch(progressLoading(100));
        toast.error(parsedData.msg);
      }
    } catch (err) {
      dispatch(progressLoading(100));
      toast.error(err);
    }

    setDisSearchBtn(false);
  };

  const [savedSearches, setsavedSearches] = useState([]);

  const getSavedSearches = async () => {
    let savedSearch = await fetch(`${API_URL}/api/user/savedsearch`, {
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
      localStorage.setItem("savedSearches", JSON.stringify(res.result.data));
      let pushSearch = res.result.data.map((src) => {
        searchData.push({ value: src._id, label: src.name });
        return true;
      });
      if (pushSearch) {
        setsavedSearches(searchData);
      } else {
        setsavedSearches([]);
      }
    } else {
      setsavedSearches([]);
    }
  };
  // eslint-disable-next-line
  useEffect(async () => {
    if (showFilter) getSavedSearches();
  }, [showFilter]);

  const [defaultValue, setDefaultValue] = useState({
    first_name: [],
    last_name: [],
    title: [],
    country: [],
    state: [],
    city: [],
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
    keyword: []
  });

  const handleSelectChange = (inputValue, actionMeta) => {
    setDefaultValue({ ...defaultValue, [actionMeta.name]: inputValue });
  };

  const onSelectSavedSearch = async (e) => {
    if (localStorage.getItem("savedSearches")) {
      const savedSearches = await JSON.parse(
        localStorage.getItem("savedSearches")
      );
      savedSearches.map((svd) => {
        if (svd._id === e.value) {
          let first_name = [];
          if (svd.query["first_name"] !== "") {
            if (svd.query["first_name"] instanceof Array) {
              svd.query["first_name"].map((v) => {
                first_name.push({ value: v, label: v });
                return true;
              });
            } else {
              first_name = [
                {
                  value: svd.query["first_name"],
                  label: svd.query["first_name"]
                }
              ];
            }
          }

          let last_name = [];
          if (svd.query["last_name"] !== "") {
            if (svd.query["last_name"] instanceof Array) {
              svd.query["last_name"].map((v) => {
                last_name.push({ value: v, label: v });
                return true;
              });
            } else {
              last_name = [
                { value: svd.query["last_name"], label: svd.query["last_name"] }
              ];
            }
          }

          let title = [];
          if (svd.query["title"] !== "") {
            if (svd.query["title"] instanceof Array) {
              svd.query["title"].map((v) => {
                title.push({ value: v, label: v });
                return true;
              });
            } else {
              title = [
                { value: svd.query["title"], label: svd.query["title"] }
              ];
            }
          }

          let country = [];
          if (svd.query["country"] !== "") {
            if (svd.query["country"] instanceof Array) {
              svd.query["country"].map((v) => {
                country.push({ value: v, label: v });
                return true;
              });
            } else {
              country = [
                {
                  value: svd.query["country"],
                  label: svd.query["country"]
                }
              ];
            }
          }

          let state = [];
          if (svd.query["state"] !== "") {
            if (svd.query["state"] instanceof Array) {
              svd.query["state"].map((v) => {
                state.push({ value: v, label: v });
                return true;
              });
            } else {
              state = [
                {
                  value: svd.query["state"],
                  label: svd.query["state"]
                }
              ];
            }
          }

          let city = [];
          if (svd.query["city"] !== "") {
            if (svd.query["city"] instanceof Array) {
              svd.query["city"].map((v) => {
                city.push({ value: v, label: v });
                return true;
              });
            } else {
              city = [
                {
                  value: svd.query["city"],
                  label: svd.query["city"]
                }
              ];
            }
          }

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

          let role_finance = [];
          if (svd.query["role_finance"] !== "") {
            if (svd.query["role_finance"] instanceof Array) {
              svd.query["role_finance"].map((v) => {
                role_finance.push({ value: v, label: v });
                return true;
              });
            } else {
              role_finance = [
                {
                  value: svd.query["role_finance"],
                  label: svd.query["role_finance"]
                }
              ];
            }
          }

          let role_hr = [];
          if (svd.query["role_hr"] !== "") {
            if (svd.query["role_hr"] instanceof Array) {
              svd.query["role_hr"].map((v) => {
                role_hr.push({ value: v, label: v });
                return true;
              });
            } else {
              role_hr = [
                { value: svd.query["role_hr"], label: svd.query["role_hr"] }
              ];
            }
          }

          let role_marketing = [];
          if (svd.query["role_marketing"] !== "") {
            if (svd.query["role_marketing"] instanceof Array) {
              svd.query["role_marketing"].map((v) => {
                role_marketing.push({ value: v, label: v });
                return true;
              });
            } else {
              role_marketing = [
                {
                  value: svd.query["role_marketing"],
                  label: svd.query["role_marketing"]
                }
              ];
            }
          }

          let role_purchase = [];
          if (svd.query["role_purchase"] !== "") {
            if (svd.query["role_purchase"] instanceof Array) {
              svd.query["role_purchase"].map((v) => {
                role_purchase.push({ value: v, label: v });
                return true;
              });
            } else {
              role_purchase = [
                {
                  value: svd.query["role_purchase"],
                  label: svd.query["role_purchase"]
                }
              ];
            }
          }

          let role_operation = [];
          if (svd.query["role_operation"] !== "") {
            if (svd.query["role_operation"] instanceof Array) {
              svd.query["role_operation"].map((v) => {
                role_operation.push({ value: v, label: v });
                return true;
              });
            } else {
              role_operation = [
                {
                  value: svd.query["role_operation"],
                  label: svd.query["role_operation"]
                }
              ];
            }
          }

          let role_corporate = [];
          if (svd.query["role_corporate"] !== "") {
            if (svd.query["role_corporate"] instanceof Array) {
              svd.query["role_corporate"].map((v) => {
                role_corporate.push({ value: v, label: v });
                return true;
              });
            } else {
              role_corporate = [
                {
                  value: svd.query["role_corporate"],
                  label: svd.query["role_corporate"]
                }
              ];
            }
          }

          let role_it = [];
          if (svd.query["role_it"] !== "") {
            if (svd.query["role_it"] instanceof Array) {
              svd.query["role_it"].map((v) => {
                role_it.push({ value: v, label: v });
                return true;
              });
            } else {
              role_it = [
                { value: svd.query["role_it"], label: svd.query["role_it"] }
              ];
            }
          }

          let role_others = [];
          if (svd.query["role_others"] !== "") {
            if (svd.query["role_others"] instanceof Array) {
              svd.query["role_others"].map((v) => {
                role_others.push({ value: v, label: v });
                return true;
              });
            } else {
              role_others = [
                {
                  value: svd.query["role_others"],
                  label: svd.query["role_others"]
                }
              ];
            }
          }

          let company_size_range = [];
          if (svd.query["company_size_range"] !== "") {
            if (svd.query["company_size_range"] instanceof Array) {
              svd.query["company_size_range"].map((v) => {
                company_size_range.push({ value: v, label: v });
                return true;
              });
            } else {
              company_size_range = [
                {
                  value: svd.query["company_size_range"],
                  label: svd.query["company_size_range"]
                }
              ];
            }
          }

          let revenue_range = [];
          if (svd.query["revenue_range"] !== "") {
            if (svd.query["revenue_range"] instanceof Array) {
              svd.query["revenue_range"].map((v) => {
                revenue_range.push({ value: v, label: v });
                return true;
              });
            } else {
              revenue_range = [
                {
                  value: svd.query["revenue_range"],
                  label: svd.query["revenue_range"]
                }
              ];
            }
          }

          let industry = [];
          if (svd.query["industry"] !== "") {
            if (svd.query["industry"] instanceof Array) {
              svd.query["industry"].map((v) => {
                industry.push({ value: v, label: v });
                return true;
              });
            } else {
              industry = [
                { value: svd.query["industry"], label: svd.query["industry"] }
              ];
            }
          }

          let keyword = [];
          if (svd.query["keyword"] !== "") {
            if (svd.query["keyword"] instanceof Array) {
              svd.query["keyword"].map((v) => {
                keyword.push({ value: v, label: v });
                return true;
              });
            } else {
              keyword = [
                { value: svd.query["keyword"], label: svd.query["keyword"] }
              ];
            }
          }

          let domain = [];
          if (svd.query["domain"] !== "") {
            if (svd.query["domain"] instanceof Array) {
              svd.query["domain"].map((v) => {
                domain.push({ value: v, label: v });
                return true;
              });
            } else {
              domain = [
                { value: svd.query["domain"], label: svd.query["domain"] }
              ];
            }
          }

          setDefaultValue({
            ...defaultValue,
            first_name: first_name,
            last_name: last_name,
            title: title,
            country: country,
            state: state,
            city: city,
            company_name: company_name,
            company_country: company_country,
            company_state: company_state,
            company_city: company_city,
            role_finance: role_finance,
            role_hr: role_hr,
            role_marketing: role_marketing,
            role_purchase: role_purchase,
            role_operation: role_operation,
            role_corporate: role_corporate,
            role_it: role_it,
            role_others: role_others,
            company_size_range: company_size_range,
            revenue_range: revenue_range,
            industry: industry,
            domain: domain,
            keyword: keyword
          });

          let x = 0;

          if (svd.query.company_type && svd.query.company_type !== "") {
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

          if (svd.query.department && svd.query.department !== "") {
            if (svd.query["department"] instanceof Array) {
              let department = document.getElementsByName("department");
              for (var j = 0; j < department.length; j++) {
                department[j].checked = false;
              }
              svd.query["department"].map((v) => {
                for (x = 0; x < department.length; x++) {
                  // department[x].checked = false;
                  if (department[x].value === v) {
                    department[x].click();
                  }
                }
                return true;
              });
            }
          } else {
            let department = document.getElementsByName("department");
            if (department) {
              for (x = 0; x < department.length; x++) {
                department[x].checked = false;
              }
            }
          }

          if (svd.query.seniority_level && svd.query.seniority_level !== "") {
            if (svd.query["seniority_level"] instanceof Array) {
              let seniority_level =
                document.getElementsByName("seniority_level");
              svd.query["seniority_level"].map((v) => {
                for (x = 0; x < seniority_level.length; x++) {
                  if (seniority_level[x].value === v) {
                    seniority_level[x].checked = true;
                  }
                }
                return true;
              });
            }
          } else {
            let seniority_level = document.getElementsByName("seniority_level");
            if (seniority_level) {
              for (x = 0; x < seniority_level.length; x++) {
                seniority_level[x].checked = false;
              }
            }
          }
        }

        return true;
      });
      document.getElementById("savedSearchBtn").click();
    }
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

  const setDefaultValueGroupFunction = (options, name) => {
    setDefaultValue({ ...defaultValue, [name]: options });
  };

  const createGroup = (groupName, options, name) => {
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
            {groupName}
          </div>
        );
      })(),
      options: options
    };
  };

  let countryOptionsPerson = [
    countryGroup.map((countryGrp) => {
      return createGroup(countryGrp.label, countryGrp.options, "country");
    })
  ];

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
    <>
      <div
        className="card border-0 shadow-none"
        style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}
      >
        <div className="card-body">
          <h4 className="fw-lighter text-center mb-2">
            Search Potential Contacts.
          </h4>
          <div className="container mt-3" style={{ maxWidth: "992px" }}>
            <form id="search_form" onSubmit={searchPeople}>
              <div
                style={{ height: "calc(100vh - 240px)", overflowY: "scroll" }}
                className="p-3"
              >
                <h6 className="fw-bold">Search by Person Name</h6>
                <div className="row mb-3">
                  <div className="col-md-4 col-lg-4 title-relative">
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
                    <p style={{ fontSize: "12px" }} className="mb-0 mt-1">
                      Use tab/enter for multi selection.
                    </p>
                  </div>
                  <div className="col-md-4 col-lg-4 title-relative">
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
                    <p style={{ fontSize: "12px" }} className="mb-0 mt-1">
                      Use tab/enter for multi selection.
                    </p>
                  </div>
                </div>

                <div className="d-flex selectAllCheckbox align-items-center mb-2">
                  <h6 className="fw-bold me-3 mb-0">Search By Company Type</h6>
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
                      <label
                        className="form-check-label"
                        htmlFor="industry-top"
                      >
                        Industry Leaders
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
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex selectAllCheckbox align-items-center mb-2">
                  <h6 className="fw-bold me-3 mb-0">Search by Department</h6>
                  <span>Select</span>{" "}
                  <span
                    className="selectBtn"
                    onClick={() => {
                      selectAllCheckbox("department");
                    }}
                  >
                    All
                  </span>{" "}
                  <span>/</span>{" "}
                  <span
                    className="selectBtn"
                    onClick={() => {
                      selectNoneCheckbox("department");
                    }}
                  >
                    None
                  </span>
                </div>
                <div className="row mb-1">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input department_checkbox"
                        name="department"
                        type="checkbox"
                        value="finance"
                        id="finance"
                        data-role="role_finance"
                        onChange={handleDepartment}
                      />
                      <label className="form-check-label" htmlFor="finance">
                        Finance &amp; Accounts
                      </label>
                    </div>
                    {deptState.finance && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={defaultValue.role_finance}
                        isMulti
                        onChange={handleSelectChange}
                        name="role_finance"
                        options={departmentRole.finance}
                        className="basic-multi-select"
                        placeholder="Select Role"
                      />
                    )}
                  </div>

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input department_checkbox"
                        name="department"
                        type="checkbox"
                        value="human"
                        data-role="role_hr"
                        id="hr"
                        onChange={handleDepartment}
                      />
                      <label className="form-check-label" htmlFor="hr">
                        Human Resources
                      </label>
                    </div>
                    {deptState.human && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={defaultValue.role_hr}
                        isMulti
                        onChange={handleSelectChange}
                        name="role_hr"
                        options={departmentRole.hr}
                        className="basic-multi-select"
                        placeholder="Select Role"
                      />
                    )}
                  </div>

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input department_checkbox"
                        name="department"
                        type="checkbox"
                        value="marketing"
                        data-role="role_marketing"
                        id="sales-marketing"
                        onChange={handleDepartment}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="sales-marketing"
                      >
                        Sales &amp; Marketing
                      </label>
                    </div>
                    {deptState.marketing && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={defaultValue.role_marketing}
                        isMulti
                        onChange={handleSelectChange}
                        name="role_marketing"
                        options={departmentRole.marketing}
                        className="basic-multi-select"
                        placeholder="Select Role"
                      />
                    )}
                  </div>
                </div>
                <div className="row mb-1">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input department_checkbox"
                        name="department"
                        type="checkbox"
                        value="purchase"
                        id="purchase"
                        data-role="role_purchase"
                        onChange={handleDepartment}
                      />
                      <label className="form-check-label" htmlFor="purchase">
                        Purchase &amp; Supply Chain
                      </label>
                    </div>
                    {deptState.purchase && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={defaultValue.role_purchase}
                        isMulti
                        onChange={handleSelectChange}
                        name="role_purchase"
                        options={departmentRole.purchase}
                        className="basic-multi-select"
                        placeholder="Select Role"
                      />
                    )}
                  </div>

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input department_checkbox"
                        name="department"
                        type="checkbox"
                        value="operation"
                        id="operation"
                        data-role="role_operation"
                        onChange={handleDepartment}
                      />
                      <label className="form-check-label" htmlFor="operation">
                        Manufacturing Operations
                      </label>
                    </div>
                    {deptState.operation && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={defaultValue.role_operation}
                        isMulti
                        onChange={handleSelectChange}
                        name="role_operation"
                        options={departmentRole.operation}
                        className="basic-multi-select"
                        placeholder="Select Role"
                      />
                    )}
                  </div>

                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input department_checkbox"
                        name="department"
                        type="checkbox"
                        value="corporate"
                        id="corporate"
                        data-role="role_corporate"
                        onChange={handleDepartment}
                      />
                      <label className="form-check-label" htmlFor="corporate">
                        Corporate/HQ
                      </label>
                    </div>
                    {deptState.corporate && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={defaultValue.role_corporate}
                        isMulti
                        onChange={handleSelectChange}
                        name="role_corporate"
                        options={departmentRole.corporate}
                        className="basic-multi-select"
                        placeholder="Select Role"
                      />
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input department_checkbox"
                        name="department"
                        type="checkbox"
                        value="it"
                        data-role="role_it"
                        id="it"
                        onChange={handleDepartment}
                      />
                      <label className="form-check-label" htmlFor="it">
                        IT
                      </label>
                    </div>
                    {deptState.it && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={defaultValue.role_it}
                        isMulti
                        onChange={handleSelectChange}
                        name="role_it"
                        options={departmentRole.it}
                        className="basic-multi-select"
                        placeholder="Select Role"
                      />
                    )}
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input department_checkbox"
                        name="department"
                        type="checkbox"
                        value="others"
                        id="other"
                        data-role="role_others"
                        onChange={handleDepartment}
                      />
                      <label className="form-check-label" htmlFor="other">
                        Others
                      </label>
                    </div>
                    {deptState.others && (
                      <Select
                        defaultValue={[]}
                        closeMenuOnSelect={false}
                        value={defaultValue.role_others}
                        isMulti
                        onChange={handleSelectChange}
                        name="role_others"
                        options={departmentRole.others}
                        className="basic-multi-select"
                        placeholder="Select Role"
                      />
                    )}
                  </div>
                </div>

                <div className="d-flex selectAllCheckbox align-items-center mb-2">
                  <h6 className="fw-bold me-3 mb-0">Search by Seniority</h6>
                  <span>Select</span>{" "}
                  <span
                    className="selectBtn"
                    onClick={() => {
                      selectAllCheckbox("seniority_level");
                    }}
                  >
                    All
                  </span>{" "}
                  <span>/</span>{" "}
                  <span
                    className="selectBtn"
                    onClick={() => {
                      selectNoneCheckbox("seniority_level");
                    }}
                  >
                    None
                  </span>
                </div>
                <div className="row mb-1">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input seniority"
                        name="seniority_level"
                        type="checkbox"
                        value="Director"
                        id="director"
                      />
                      <label className="form-check-label" htmlFor="director">
                        Director
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input seniority"
                        name="seniority_level"
                        type="checkbox"
                        value="Owner"
                        id="owner"
                      />
                      <label className="form-check-label" htmlFor="owner">
                        Onwer/Partner
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input seniority"
                        name="seniority_level"
                        type="checkbox"
                        value="Founder"
                        id="founder"
                      />
                      <label className="form-check-Founder" htmlFor="founder">
                        Founder
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-1">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input seniority"
                        name="seniority_level"
                        type="checkbox"
                        value="C Suite"
                        id="csuite"
                      />
                      <label className="form-check-label" htmlFor="csuite">
                        C Suite
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input seniority"
                        name="seniority_level"
                        type="checkbox"
                        value="VP"
                        id="vp"
                      />
                      <label className="form-check-label" htmlFor="vp">
                        VP
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input seniority"
                        name="seniority_level"
                        type="checkbox"
                        value="HOD"
                        id="hod"
                      />
                      <label className="form-check-label" htmlFor="hod">
                        HOD
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input seniority"
                        name="seniority_level"
                        type="checkbox"
                        value="Manager"
                        id="manager"
                      />
                      <label className="form-check-label" htmlFor="manager">
                        Manager
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input seniority"
                        name="seniority_level"
                        type="checkbox"
                        value="Officer"
                        id="officer"
                      />
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
                      name="title"
                      onChange={handleSelectChange}
                      value={defaultValue.title}
                      options={titleOptions}
                      className="basic-multi-select"
                      placeholder="Select Title"
                    />
                  </div>
                </div>

                <h6 className="fw-bold">Search by Person's Location</h6>
                <div className="row mb-3">
                  <div className="col-md-4 col-lg-4 title-relative">
                    <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      isMulti
                      name="country"
                      onChange={handleSelectChange}
                      value={defaultValue.country}
                      options={countryOptionsPerson[0]}
                      className="basic-multi-select"
                      placeholder="Person's Country"
                      styles={{ background: "#000" }}
                    />
                  </div>
                  <div className="col-md-4 col-lg-4 title-relative">
                    <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      noOptionsMessage={({ inputValue }) => "Type to search.."}
                      isMulti
                      name="state"
                      onChange={handleSelectChange}
                      value={defaultValue.state}
                      options={states}
                      onKeyDown={handleState}
                      className="basic-multi-select"
                      placeholder="Person's State"
                    />
                  </div>
                  <div className="col-md-4 col-lg-4 title-relative">
                    <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      noOptionsMessage={({ inputValue }) => "Type to search.."}
                      isMulti
                      name="city"
                      onChange={handleSelectChange}
                      value={defaultValue.city}
                      options={cities}
                      onKeyDown={handleCity}
                      className="basic-multi-select"
                      placeholder="Person's City"
                    />
                  </div>
                </div>
                <h6 className="fw-bold">Search by Company</h6>
                <div className="row mb-3">
                  <div className="col-md-4 col-lg-4 title-relative">
                    <Select
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
                    />
                    <p style={{ fontSize: "12px" }} className="mb-0 mt-1">
                      Use tab/enter for multi selection.
                    </p>
                  </div>
                  <div className="col-md-4 col-lg-4 title-relative">
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
                  <div className="col-md-4 col-lg-4 title-relative">
                    <Select
                      defaultValue={[]}
                      closeMenuOnSelect={false}
                      isMulti
                      name="revenue_range"
                      options={revenueRange}
                      className="basic-multi-select"
                      placeholder="Select Revenue Range"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4 col-lg-4 title-relative">
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
                  <div className="col-md-4 col-lg-4 title-relative">
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
                  <div className="col-md-4 col-lg-4 title-relative">
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
                  <div className="col-md-4 col-lg-4 title-relative">
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
                  <div className="col-md-4 col-lg-4 title-relative">
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
                    <p style={{ fontSize: "12px" }} className="mb-0 mt-1">
                      Use tab/enter for multi selection.
                    </p>
                  </div>
                  <div className="col-md-4 col-lg-4 title-relative">
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
                    <p style={{ fontSize: "12px" }} className="mb-0 mt-1">
                      Use tab/enter for multi selection.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="d-flex justify-content-center title-absolute py-4 border-top"
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
                    window.location.reload(false);
                  }}
                  className="btn btn-outline-secondary"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mx-3"
                  id="search_btn"
                  style={{ width: "160px" }}
                  disabled={disSearchBtn && "disabled"}
                >
                  Run Search Query
                </button>
                <span className="dropup">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    id="savedSearchBtn"
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
                        noOptionsMessage={({ inputValue }) => "No search found"}
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
                <Link
                  to="/radar/people/watchlist"
                  className="btn btn-primary d-flex align-items-center ms-3"
                >
                  <i className="fas fa-bookmark me-2"></i> My Watchlist
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
