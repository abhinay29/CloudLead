import React, { useState } from "react";
import PeopleState from "../Context/People/PeopleState";
import Filter from "../People/Filter";
import Table from "../People/Table";

const People = () => {
  const [showFilter, setShowFilter] = useState(true);
  const [showTable, setShowTable] = useState(false);

  return (
    <PeopleState>
      {/* <div className={`${showFilter === true ? 'd-block' : 'd-none'}`}>
        
      </div>
      <div className={`${showTable === true ? 'd-block' : 'd-none'}`}>
        <Table setShowFilter={setShowFilter} setShowTable={setShowTable} />
      </div> */}
      {showFilter && (
        <Filter
          setShowTable={setShowTable}
          setShowFilter={setShowFilter}
          showFilter={showFilter}
        />
      )}
      {showTable && (
        <Table setShowFilter={setShowFilter} setShowTable={setShowTable} />
      )}
    </PeopleState>
  );
};

export default People;
