const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('a definition of data', () => {
  test('all blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  
  test('ID is defined, not _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
  })
})

describe('Add, update and delete', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'uusi blogi',
      author: 'uusi blogaaja',
      url: 'www.uusiblogi.fi',
      likes: 1
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(newBlog.title)
  })

  test('fails with statuscode 400 Bad request, if adding data invalid', async () => {
    const newBlog = {
      likes: 1
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('if likes is undefined, it is zero', async () => {
    const undefinedLikesBlog = {
      title: 'uusi blogi',
      author: 'uusi blogaaja',
      url: 'www.uusiblogi.fi'
    }
  
    await Blog.deleteMany({})
  
    await api
      .post('/api/blogs')
      .send(undefinedLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    const likes = blogsAtEnd[0].likes
    expect(likes).toEqual(0)
  })
  
  test('a blog can be delete', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogsToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogsToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  
    const titles = blogsAtEnd.map(b => b.title)
  
    expect(titles).not.toContain(blogsToDelete.title)
  })
  
  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogsToUpdate = blogsAtStart[0]
  
    const update = {
      title: 'uusi nimi blogi',
      likes: 1000
    }
  
    await api
      .put(`/api/blogs/${blogsToUpdate.id}`)
      .send(update)
      .expect(200)
    
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]
    
    expect(update.title).toEqual(updatedBlog.title)
    expect(update.likes).toEqual(updatedBlog.likes) 
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salainensanan', 10)
    const user = new User({ username: 'root', name: 'pekka', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Testaaja',
      name: 'Timo Testaaja',
      password: 'salasana'
    }

    await api 
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(userAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails with statuscode 400 Bad request, if adding data invalid', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Testaaja',
      name: 'Timo Testaaja',
      password: 'sa'
    }

    const newUser2 = {
      username: 'TT',
      name: 'Timo Testaaja',
      password: 'salasana'
    }

    await api 
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api 
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(userAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username, newUser2.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})