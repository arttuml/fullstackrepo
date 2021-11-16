import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import { useApolloClient } from '@apollo/client'
import { useEffect } from 'react/cjs/react.development'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  
  useEffect(() => {
    const token = localStorage.getItem('user-token')
    if (token){
      setToken(token)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
          ? <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommend')}>recommend</button> 
              <button onClick={logout}> log out </button>
            </>
          : <button onClick={() => setPage('login') }>login</button> }
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <LoginForm
        show= {page === 'login'}
        setToken={setToken}
        setPage={setPage} 
      />

      <Recommend
        show={page === 'recommend'}
      />

    </div>
  )
}

export default App