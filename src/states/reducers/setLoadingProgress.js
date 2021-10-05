const setLoadingProgress = (state = 0, action) => {
  if (action.type === 'loadingProgress') {
    return state = action.payload
  } else {
    return state
  }
}

export default setLoadingProgress