const notificationReducer = (state = null, action) => {
  switch (action.type) {
  case 'NOTIFY':
    return action.data
  case 'RESET':
    return null
  default:
    return state
  }
}

let timeoutId

export const notify = (content) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFY',
      data: {
        message: content.message,
        type: content.type
      }
    })
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      dispatch({ type: 'RESET' })
    }, 5000)
  }
}

export const resetNotification = () => {
  return {
    type: 'RESET'
  }
}

export default notificationReducer