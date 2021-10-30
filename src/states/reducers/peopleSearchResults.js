const peopleSearchResults = (state = '', action) => {
  if (action.type === 'peopleSearchResult') {
    return state = action.payload
  } else {
    return state
  }
}

export default peopleSearchResults