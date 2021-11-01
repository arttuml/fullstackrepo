import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, removeBlog, updateBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

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
    <div id="blog" style={blogStyle}>
      <div style={hideWhenVisible} className="blogInfo">
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="moreBlogInfo">
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