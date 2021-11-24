const sequenceReducer = (state = [], action) => {
  if (action.type === 'sequenceList') {
    return state = action.payload
  } else {
    return state
  }
}

export default sequenceReducer