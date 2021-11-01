const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if ( blogs.length===0) {
    return null
  }

  const blogsByAuthor = _.toPairs(_.groupBy(blogs, b => b.author))
  const blockCountByAuthor = blogsByAuthor.map(([author, blogs]) => ({
    author, 
    blogs: blogs.length
  }) ).sort((a1, a2 ) => a2.blogs - a1.blogs)

  return blockCountByAuthor[0]
}

const mostLikes = (blogs) => {
  if ( blogs.length===0) {
    return null
  }

  const blogsByAuthor = _.toPairs(_.groupBy(blogs, b => b.author))
  const likeCountByAuthor = blogsByAuthor.map(([author, blogs]) => ({
    author, 
    likes: blogs.reduce((s, b) => s + b.likes, 0)
  }) ).sort((a1, a2 ) => a2.likes - a1.likes)

  return likeCountByAuthor[0]
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
