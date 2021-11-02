import blogService from '../services/blogs'

const byLikes = (a,b) => b.likes - a.likes

const blogReducer = ( state = [], action ) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'INIT_BLOGS':
    return action.data.sort(byLikes)
  case 'LIKE': {
    const liked = action.data
    return state.map(a => a.id===liked.id ? liked : a).sort(byLikes)
  }
  case 'REMOVE':
    return state.filter(blog => blog.id !== action.id)
  default:
    return state
  }
}

export const createBlog = (content) => {
  return {
    type: 'NEW_BLOG',
    data: content
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const data = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data
    })
  }
}

export const likeBlog = (blog) => {
  return {
    type: 'LIKE',
    data: blog
  }
}

export const deleteBlog = (id) => {
  return {
    type: 'REMOVE',
    id
  }
}

export default blogReducer