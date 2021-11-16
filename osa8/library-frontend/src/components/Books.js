
import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)

  if (result.loading)  {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }
  
  let books = result.data.allBooks

  if (filter) {
    books = books.filter(a => a.genres.includes(filter))
  }

  return (
    <div>
      <h2>books</h2>
      {filter ? <p>in genre <b>{filter}</b></p> : null}
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
      <button onClick={() => setFilter('comedy')}>comedy</button>
      <button onClick={() => setFilter('crime')}>crime</button>
      <button onClick={() => setFilter('classic')}>classic</button>
      <button onClick={() => setFilter(null)}>all genres</button>
    </div>
  )
}

export default Books