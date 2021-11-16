import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = (props) => {
  const result = useQuery(ALL_BOOKS)
  const favoriteGenreResult = useQuery(ME)
  if (result.loading)  {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }
  
  
  const favoriteGenre = favoriteGenreResult.data.me.favoriteGenre
  const books = result.data.allBooks.filter(a => a.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favoriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend