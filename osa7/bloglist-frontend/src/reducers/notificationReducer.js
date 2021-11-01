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

export const notify = (content) => {
  return {
    type: 'NOTIFY',
    data: {
      message: content.message,
      type: content.type
    }
  }
}

export const resetNotification = () => {
  return {
    type: 'RESET'
  }
}

export default notificationReducer