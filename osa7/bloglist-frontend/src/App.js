import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import blogService from './services/blogs'
import loginService from './services/login'
import User from './components/User'
import { notify } from './reducers/notificationReducer'
import { createBlog, initializeBlogs } from './reducers/blogReducer'
import { login, logout } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route,
  Link
} from 'react-router-dom'
import { initializeUsers } from './reducers/usersReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(login(user))
      blogService.setToken(user.token)
    }
  },[])

  const notifyWith = (message, type='success') => {
    dispatch(notify({ message, type }))
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      dispatch(createBlog(returnedBlog))
      notifyWith('blog added')
    } catch (expection) {
      notifyWith('unable to add the blog, did you forgot to add the name or author?','error')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      dispatch(login(user))
      setUsername('')
      setPassword('')
    } catch (expection) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(logout())
  }

  const loginForm = () => (
    <div>
      <LoginForm
        handleSubmit={handleLogin}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        username={username}
        password={password}
      />
    </div>
  )

  const blogForm = () => {
    return(
      <Togglable buttonlabel='create new blog' >
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    )
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const padding = {
    padding: 10
  }

  const navbar = {
    backgroundColor: '#a8b0b3',
    padding: 5
  }

  return (
    <div>
      <Notification />
      {user === null ?
        loginForm() :
        <div>
          <div>
            <div style={navbar}>
              <Link style={padding} to="/">blogs</Link>
              <Link style={padding} to="/users">users</Link>
              <em style={padding}>{user.name} logged in <button onClick={handleLogout}>logout</button></em>
            </div>
            <h2>blog app</h2>
          </div>
          <Switch>
            <Route path="/blogs/:id">
              <Blog />
            </Route>
            <Route path="/users/:id">
              <User />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              {blogForm()}
              {blogs.map(blog =>
                <div key={blog.id} style={blogStyle}>
                  <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
                </div>
              )}
            </Route>
          </Switch>
        </div>
      }
    </div>
  )
}

export default App