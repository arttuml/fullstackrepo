import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, removeBlog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  const user = JSON.parse(loggedUserJSON)

  const removeButtonStyle = {
    color: 'red',
    display: user.username === blog.user.username ? '' : 'none'
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const deleteBlog = () => {
    const ok = window.confirm(`Remoe blog ${blog.title} by ${blog.author}?`)
    if (ok) {
      removeBlog(blog.id)
    }
  }

  const addLike = () => {
    const newObject = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, newObject)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        <br /> {blog.url}
        <br /> likes {blog.likes} <button onClick={addLike}>like</button>
        <br /> {blog.user.name}
        <br /> <button style={removeButtonStyle} onClick={deleteBlog}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired,
  updateBlog: PropTypes.func.isRequired
}

export default Blog