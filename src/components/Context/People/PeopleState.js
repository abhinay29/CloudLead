import PeopleContext from "./PeopleContext";
import { useState } from "react";

const PeopleState = (props) => {
  const peopleInitial = []
  const [peoples, setPeoples] = useState(peopleInitial)
  const [totalPeople, settotpeople] = useState(0);
  const [uniqueComp, setunicomp] = useState(0);

  const getPeoples = async (json) => {
    setPeoples(json)
  }

  const setTotalPeople = async (val) => {
    settotpeople(val)
  }

  const setUniqueComp = async (val) => {
    setunicomp(val)
  }

  return (
    <PeopleContext.Provider value={{ peoples, getPeoples, totalPeople, setTotalPeople, uniqueComp, setUniqueComp }}>
      {props.children}
    </PeopleContext.Provider>
  )

}
export default PeopleState;