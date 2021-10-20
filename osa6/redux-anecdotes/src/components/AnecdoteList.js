import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'
import { addNotification, resetNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const anecdotes = useSelector(state => {
    const withFilter = anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    return state.anecdotes.filter(withFilter)
  })
  

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    
    dispatch(addNotification(`you voted '${anecdote.content}'`))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }

  const byVotes = (a, b) => b.votes - a.votes

  return ( 
    <div>
      {anecdotes.sort(byVotes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList