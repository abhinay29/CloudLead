export const progressLoading = (progress) => {
  return (dispatch) => {
    dispatch({
      type: "loadingProgress",
      payload: progress
    });
  };
};

export const userInfo = (userData) => {
  return (dispatch) => {
    dispatch({
      type: "userData",
      payload: userData
    });
  };
};

export const cockpitData = (data) => {
  return (dispatch) => {
    dispatch({
      type: "cockpitData",
      payload: data
    });
  };
};

export const watchList = (watchListData) => {
  return (dispatch) => {
    dispatch({
      type: "watchList",
      payload: watchListData
    });
  };
};

export const setPeopleSearchResults = (searchData) => {
  return (dispatch) => {
    dispatch({
      type: "peopleSearchResult",
      payload: searchData
    });
  };
};

export const setSequenceList = (listObj) => {
  return (dispatch) => {
    dispatch({
      type: "sequenceList",
      payload: listObj
    });
  };
};
