import CompanyContext from "./CompanyContext";
import { useState } from "react";

const CompanyState = (props) => {

  const companyInitial = []
  const [companies, setCompanies] = useState(companyInitial)
  const [totalComapany, setTotalCompany] = useState(0);

  const getCompanies = async (json) => {
    setCompanies(json)
  }

  const setTotalComp = async (val) => {
    setTotalCompany(val)
  }

  return (
    <CompanyContext.Provider value={{ companies, getCompanies, totalComapany, setTotalComp }}>
      {props.children}
    </CompanyContext.Provider>
  )

}
export default CompanyState;