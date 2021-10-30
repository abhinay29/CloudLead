const setUserData = (state = '', action) => {
  if (action.type === 'userData') {
    return state = action.payload
  } else {
    return state
  }
}

export default setUserData