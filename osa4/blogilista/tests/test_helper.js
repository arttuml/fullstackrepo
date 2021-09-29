const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Pekan blogi',
    author: 'Pekka blogaaja',
    url: 'www.pekanblogi.fi',
    likes: 69
  },
  {
    title: 'Penan blogi',
    author: 'Pentti blogaaja',
    url: 'www.penanblogi.fi',
    likes: 666
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb
}