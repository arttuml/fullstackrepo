import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'
import { addNotification, resetNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    
    dispatch(addNotification(`you voted '${anecdote.content}'`))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }

  const byVotes = (a, b) => b.votes - a.votes
  const withFilter = anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())

  return ( 
    <div>
      {anecdotes.filter(withFilter).sort(byVotes).map(anecdote =>
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