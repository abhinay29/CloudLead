import React from "react";

function SearchStrings(props) {
  const { fh } = props;
  return (
    <>
      {fh.first_name ? <div>First Name: {String(fh.first_name)}</div> : ""}
      {fh.last_name ? <div>Last Name: {String(fh.last_name)}</div> : ""}
      {fh.title ? <div>Title: {String(fh.title)}</div> : ""}
      {fh.city ? <div>City: {String(fh.city)}</div> : ""}
      {fh.state ? <div>State: {String(fh.state)}</div> : ""}
      {fh.country ? <div>Country: {String(fh.country)}</div> : ""}
      {fh.department ? <div>Department: {String(fh.department)}</div> : ""}
      {fh.role ? <div>Role: {String(fh.role)}</div> : ""}
      {fh.seniority_level ? (
        <div>Seniority: {String(fh.seniority_level)}</div>
      ) : (
        ""
      )}
      {fh.company_city ? (
        <div>Company City: {String(fh.company_city)}</div>
      ) : (
        ""
      )}
      {fh.company_state ? (
        <div>Company State: {String(fh.company_state)}</div>
      ) : (
        ""
      )}
      {fh.company_country ? (
        <div>Company Country: {String(fh.company_country)}</div>
      ) : (
        ""
      )}
      {fh.company_name ? (
        <div>Company Name: {String(fh.company_name)}</div>
      ) : (
        ""
      )}
      {fh.company_size_range ? (
        <div>Company Size Range: {String(fh.company_size_range)}</div>
      ) : (
        ""
      )}
      {fh.revenue_range ? (
        <div>Revenue Range: {String(fh.revenue_range)}</div>
      ) : (
        ""
      )}
      {fh.industry ? <div>Industry: {String(fh.industry)}</div> : ""}
      {fh.domain ? <div>Domain: {String(fh.domain)}</div> : ""}
      {fh.keyword ? <div>Keyword: {String(fh.keyword)}</div> : ""}
    </>
  );
}

export default SearchStrings;
