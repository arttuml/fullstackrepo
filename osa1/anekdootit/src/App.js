import React, { useState } from 'react'

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

c

const MostVotes = ({anecdotes, points}) => {
  if (Math.max(...points) === 0) {
    return (
    <>
      <h1>Anecdote with most votes</h1>
      <div>No votes given</div>
    </>
    )
  }

  const copy = [...points]
  let largest = 0
  let mostvotes = 0

  for (let i=0; i<copy.length; i++) {
    if (copy[i]>largest) {
      largest = copy[i]
      mostvotes = i;   
    }
  }

  return (
    <>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostvotes]}</p>
      <p>has {largest} votes</p>
    </>
  )

}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const handleNextClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const handleVoteClick = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <h1>Anecdotes of the day</h1>
      {anecdotes[selected]}
      <p>has {points[selected]} votes</p>
      <Button handleClick = {handleNextClick} text = "next anecdote"/>
      <Button handleClick = {handleVoteClick} text = "Vote"/>
      <MostVotes anecdotes = {anecdotes} points = {points} />
    </div>
  )
}

export default App
