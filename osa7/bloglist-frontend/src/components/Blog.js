import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const Blog = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const id = useParams().id
  const blog = blogs.find(n => n.id === id)

  if (!blog || !user) {
    return null
  }

  const removeButtonStyle = {
    color: 'red',
    display: user.username === blog.user.username ? '' : 'none'
  }

  const deleteBlog = async () => {
    const ok = window.confirm(`Remoe blog ${blog.title} by ${blog.author}?`)
    if (ok) {
      try {
        await blogService.remove(id)
        dispatch(removeBlog(id))
        dispatch(notify({ message:'blog deleted',type:'success' }))
      } catch (expection) {
        dispatch(notify({ message:'unable to delete the blog',type:'error' }))
      }
    }
  }


  const addLike = async () => {
    const newObject = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    try {
      const updatedBlog =  await blogService.update(id, newObject)
      dispatch(likeBlog(updatedBlog))
      dispatch(notify({ message:'blog updated',type:'success' }))
    } catch (expection) {
      dispatch(notify({ message:'unable to update the blog',type:'error' }))
    }
  }

  return (
    <div>
      <h1>{blog.title} by {blog.author}</h1>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes<button onClick={addLike}>like</button></p>
      <p>added by {blog.user.name}</p>
      <button onClick={deleteBlog} style={removeButtonStyle}>remove</button>
    </div>
  )
}

export default Blog