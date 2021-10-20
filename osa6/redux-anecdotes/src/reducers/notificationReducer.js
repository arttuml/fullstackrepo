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

export const setNotification = (notification, seconds) => {
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification
    })
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds*1000 )

  }
}

export const clearNotification = () => {
    return {
        type: 'CLEAR_NOTIFICATION'
    }
  }



export default notificationReducer