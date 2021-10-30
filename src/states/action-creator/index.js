export const progressLoading = (progress) => {
  return (dispatch) => {
    dispatch({
      type: 'loadingProgress',
      payload: progress
    })
  }
}

export const userInfo = (userData) => {
  return (dispatch) => {
    dispatch({
      type: 'userData',
      payload: userData
    })
  }
}

export const watchList = (watchListData) => {
  return (dispatch) => {
    dispatch({
      type: 'watchList',
      payload: watchListData
    })
  }
}

export const setPeopleSearchResults = (searchData) => {
  return (dispatch) => {
    dispatch({
      type: 'peopleSearchResult',
      payload: searchData
    })
  }
}