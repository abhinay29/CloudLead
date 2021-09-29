import React, { useState } from 'react'
import CompanyState from '../Context/Company/CompanyState'
import Filter from '../Company/Filter'
import Table from '../Company/Table'

const Company = () => {

  const [showFilter, setShowFilter] = useState(true);
  const [showTable, setShowTable] = useState(false);

  return (
    <CompanyState>
      <div className={`${showFilter === true ? 'd-block' : 'd-none'}`}>
        <Filter setShowTable={setShowTable} setShowFilter={setShowFilter} />
      </div>
      <div className={`${showTable === true ? 'd-block' : 'd-none'}`}>
        <Table setShowFilter={setShowFilter} setShowTable={setShowTable} />
      </div>
    </CompanyState>
  )
}

export default Company
