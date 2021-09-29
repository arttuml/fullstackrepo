const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned and Content-Type is JSON', async () => {
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

test('POST blog without title and url response 400 Bad request', async () => {
  const newBlog = {
    author: 'blogaaja',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a note can be delete', async () => {
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

test('a note can be updated', async () => {
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

afterAll(() => {
  mongoose.connection.close()
})