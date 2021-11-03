import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'
import { createComment } from '../reducers/commentReducers'
import { Button, Form, Row, Col } from 'react-bootstrap'

const Blog = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const id = useParams().id
  const blog = blogs.find(n => n.id === id)
  const comments = useSelector(state => state.comments).filter(c => c.blog.id===id)

  if (!blog || !user) {
    return null
  }

  const removeButtonStyle = {
    color: 'red',
    display: user.username === blog.user.username ? '' : 'none'
  }

  const deleteBlog = async () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
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

  const addComment = async () => {
    event.preventDefault()
    const content = event.target.comment.value
    event.target.comment.value = ''
    const newObject = {
      content
    }
    try {
      const newComment = await blogService.createComment(id, newObject)
      dispatch(createComment(newComment))
      dispatch(notify({ message:'comment added',type:'success' }))
    } catch (expection) {
      dispatch(notify({ message:'unable to add the comment',type:'error' }))
    }
  }

  return (
    <div>
      <h1>{blog.title} by {blog.author}</h1>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes<Button variant="success" size="sm" onClick={addLike}>like</Button></p>
      <p>added by {blog.user.name}</p>
      <button onClick={deleteBlog} style={removeButtonStyle}>remove</button>
      <h2>comments</h2>
      <Form onSubmit={addComment}>
        <Row>
          <Col>
            <Form.Control name="comment" />
          </Col>
          <Col>
            <Button variaty="primary" type="submit">comment</Button>
          </Col>
        </Row>
      </Form>
      {comments.length === 0 ?
        <p>no comments</p> :
        <div>
          <ul>
            {comments.map(comment =>
              <li key={comment.id}>{comment.content}</li>) }
          </ul>
        </div>}
    </div>
  )
}

export default Blog