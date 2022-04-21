import React from "react";

function FreezeHistoryTable(props) {
  const { freezeHistory } = props;
  return (
    <>
      <table className="table freezeHistoryTable">
        <tbody>
          {freezeHistory.data.map((fh, count = 0) => {
            count++;
            return (
              <>
                <tr>
                  <td className="border-0">{count}</td>
                  <td className="border-0 fw-bold">{fh.search_name}</td>
                  <td className="border-0"></td>
                  <td className="border-0 text-end">{fh.date}</td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="3">
                    {fh.search_filter.first_name ? (
                      <div>
                        First Name: {String(fh.search_filter.first_name)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.last_name ? (
                      <div>Last Name: {String(fh.search_filter.last_name)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.title ? (
                      <div>Title: {String(fh.search_filter.title)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.city ? (
                      <div>City: {String(fh.search_filter.city)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.state ? (
                      <div>State: {String(fh.search_filter.state)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.country ? (
                      <div>Country: {String(fh.search_filter.country)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.seniority_level ? (
                      <div>
                        Seniority: {String(fh.search_filter.seniority_level)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.company_city ? (
                      <div>
                        Company City: {String(fh.search_filter.company_city)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.company_state ? (
                      <div>
                        Company State: {String(fh.search_filter.company_state)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.company_country ? (
                      <div>
                        Company Country:{" "}
                        {String(fh.search_filter.company_country)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.company_name ? (
                      <div>
                        Company Name: {String(fh.search_filter.company_name)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.company_size_range ? (
                      <div>
                        Company Size Range:{" "}
                        {String(fh.search_filter.company_size_range)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.revenue_range ? (
                      <div>
                        Revenue Range: {String(fh.search_filter.revenue_range)}
                      </div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.industry ? (
                      <div>Industry: {String(fh.search_filter.industry)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.domain ? (
                      <div>Domain: {String(fh.search_filter.domain)}</div>
                    ) : (
                      ""
                    )}
                    {fh.search_filter.keyword ? (
                      <div>Keyword: {String(fh.search_filter.keyword)}</div>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default FreezeHistoryTable;
