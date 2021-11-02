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
import { createBlog, initializeBlogs, likeBlog, deleteBlog } from './reducers/blogReducer'
import { login, logout } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route,
  //useRouteMatch
} from 'react-router-dom'
import { initializeUsers } from './reducers/usersReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  //const users = useSelector(state => state.users)

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

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      dispatch(deleteBlog(id))
      notifyWith('blog deleted')
    } catch (expection) {
      notifyWith('unable to delete blog')
    }
  }

  const updateBlog = async (id, newObject) => {
    try {
      const updatedBlog =  await blogService.update(id, newObject)
      dispatch(likeBlog(updatedBlog))
      notifyWith('blog updated')
    } catch (expection) {
      notifyWith('unable to update the blog')
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

  //const match = useRouteMatch('/users/:id')
  //const matchUser = match
  //  ? users.find(user => user.id === Number(match.params.id))
  //  : null

  return (
    <div>
      <div>
        <Notification />
        {user === null ?
          loginForm() :
          <div>
            <h2>blogs</h2>
            <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          </div>
        }
      </div>
      <Switch>
        <Route path="/blogs/:id">
          <p>lalal</p>
        </Route>
        <Route path="/users/:id">
          <User />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          {blogForm()}
          {blogs.map(blog => <Blog key={blog.id} blog={blog} removeBlog={removeBlog} updateBlog={updateBlog} user={user} />
          )}
        </Route>
      </Switch>
    </div>
  )
}

export default App