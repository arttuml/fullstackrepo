const notificationReducer = (state = null , action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'CLEAR_NOTIFICATION':
        return null
    default:
      return state
  }
}

let timeoutID

export const setNotification = (notification, seconds) => {
  clearTimeout(timeoutID)
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification
    })
    timeoutID = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds*1000)
  }
}

export const clearNotification = () => {
  return {
      type: 'CLEAR_NOTIFICATION'
  }
}



export default notificationReducer