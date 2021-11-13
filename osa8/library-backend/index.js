const config = require('./utils/config')
const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  
  type Author {
      name: String!
      id: ID!
      born: String
      bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.name && !args.author) {
        return await Book.find({})
      }
      const byAuthor = (book) => (args.author) ? book.author === args.author : true
      const byGenre = (book) => (args.genre) ? book.genres.includes(args.genre) : true
      return await Book.find({}).filter(byAuthor).filter(byGenre)
    },
    allAuthors: async () => await Author.find({})
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root })
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const findedAuthor = await Author.findOne({ name: args.author })
      if (!findedAuthor) {
        const author = new Author({ name: args.author })
        author.save()
      }
      
      const author = await Author.findOne({ name: args.author })
      const book = new Book({ ...args, author: author })
      book.save()
      return book
    },
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
          return null
      }
      const updatedAuthor = { ...author, born: args.setBornTo}
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor

    }
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})