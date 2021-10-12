import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotificatin] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  },[])

  const notifyWith = (message, type='success') => {
    setNotificatin({ message, type })
    setTimeout(() => {
      setNotificatin(null)
    }, 4000)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
    } catch (expection) {
      notifyWith(`unable to add the blog, did you forgot to add the name or author?`,'error')
    }
    notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (expection) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }
  
  const loginForm = () => (
    <div>
      <LoginForm 
      handleSubmit={handleLogin}
      handleUsernameChange={({target}) => setUsername(target.value)}
      handlePasswordChange={({target}) => setPassword(target.value)}
      username={username}
      password={password}
      />
    </div>
  )

  const blogForm = () => (
    <Togglable buttonlabel='create new blog' >
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  return (
    <div>
      <Notification notification={notification} />
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogs.map(blog => <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App