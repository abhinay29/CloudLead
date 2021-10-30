const initialWatchlist = (state = '', action) => {
  if (action.type === 'watchList') {
    return state = action.payload
  } else {
    return state
  }
}

export default initialWatchlist