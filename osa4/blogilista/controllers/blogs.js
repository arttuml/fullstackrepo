const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const reqUser = request.user

  if (!request.token || !reqUser.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(reqUser.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const reqUser = request.user

  if (!(blog.user.toString() === reqUser.id)) {
    return response.status(401).json({ error: 'token missing or invalid'})
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true}).populate('user', { username: 1, name: 1, id: 1})
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter