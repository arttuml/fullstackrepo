const notificationReducer = (state = null , action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'RESET_NOTIFICATION':
        return null
    default:
      return state
  }
}

export const addNotification = notification => {
  return {
      type: 'SET_NOTIFICATION',
      notification
  }
}

export const resetNotification = () => {
    return {
        type: 'RESET_NOTIFICATION'
    }
  }



export default notificationReducer