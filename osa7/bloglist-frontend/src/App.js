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
import { initializeComments } from './reducers/commentReducers'
import { Table, Nav, Navbar, Button, Container } from 'react-bootstrap'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
    dispatch(initializeComments())
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

  const padding = {
    padding: 10
  }

  return (
    <div className="container">
      <Notification />
      {user === null ?
        loginForm() :
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Navbar.Brand href="#">Blog app</Navbar.Brand>
                <Nav className="mr-auto">
                  <Nav.Link href="#" as="span">
                    <Link style={padding} to="/">home</Link>
                  </Nav.Link>
                  <Nav.Link href="#" as="span">
                    <Link style={padding} to="/user">notes</Link>
                  </Nav.Link>
                  <Nav.Link href="#" as="span">
                    <Link style={padding} to="/users">users</Link>
                  </Nav.Link>
                  <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                      <em style={padding}>{user.name} logged in <Button variant="primary" size="sm" onClick={handleLogout}>logout</Button></em>
                    </Navbar.Text>
                  </Navbar.Collapse>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
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
              <Table striped>
                <tbody>
                  {blogs.map(blog =>
                    <tr key={blog.id} >
                      <td>
                        <Link to={`/blogs/${blog.id}`}>
                          {blog.title} by {blog.author}
                        </Link>
                      </td>
                      <td>
                        {blog.user.name}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Route>
          </Switch>
        </div>
      }
    </div>
  )
}

export default App