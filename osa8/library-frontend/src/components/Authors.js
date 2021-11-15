import { useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_BORN } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('Robert Martin')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)
  
  const [ addBorn ] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (result.loading)  {
    return <div>loading...</div>
  }
  
  if (!props.show) {
    return null
  }

  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    addBorn({ variables: { name, setBornTo: born }})
    
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <label>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a => <option key={a.name} value={a.name}>{a.name}</option> )}
          </select>
        </label>
        <div>
          born <input
            type='number'
            value={born}
            onChange={({target}) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>

    </div>
  )
}

export default Authors