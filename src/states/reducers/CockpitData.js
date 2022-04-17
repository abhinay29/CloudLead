const CockpitData = (state = {}, action) => {
  if (action.type === "cockpitData") {
    return (state = action.payload);
  } else {
    return state;
  }
};

export default CockpitData;
