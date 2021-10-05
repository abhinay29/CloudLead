export const progressLoading = (progress) => {
  return (dispatch) => {
    dispatch({
      type: 'loadingProgress',
      payload: progress
    })
  }
}