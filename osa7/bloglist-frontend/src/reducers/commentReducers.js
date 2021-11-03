import blogService from '../services/blogs'

const commentReducer = ( state = [], action ) => {
  switch (action.type) {
  case 'NEW_COMMENT':
    return [...state, action.data]
  case 'INIT_COMMENTS':
    return action.data
  default:
    return state
  }
}

export const initializeComments = () => {
  return async dispatch => {
    const data = await blogService.getAllComments()
    dispatch({
      type: 'INIT_COMMENTS',
      data
    })
  }
}

export const createComment = (content) => {
  return {
    type: 'NEW_COMMENT',
    data: {
      content: content.content,
      blog: { id: content.blog },
      id: content.id
    }
  }
}


export default commentReducer