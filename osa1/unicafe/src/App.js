import React, { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  if ( (good + neutral + bad) === 0) {
    return <div>No feedback given</div>
  }

  return (
    <>
      <table>
        <tbody>
          <StatisticLine text = 'good' value = {good} />
          <StatisticLine text = 'neutral' value = {neutral} />
          <StatisticLine text = 'bad' value = {bad} />
          <StatisticLine text = 'all' value = {good + neutral + bad} />
          <StatisticLine text = 'avg' value = {(good-bad)/(good+neutral+bad)} />
          <StatisticLine text = 'postive' value = {(good/(good+bad+neutral))*100 + ' %'} />
        </tbody>
      </table>
    </>
  )
}

const StatisticLine = (props) => (
    <tr>
      <td>{props.text}</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>{props.value}</td>
    </tr>
)


const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)

  const handleNeutralClick = () => setNeutral(neutral + 1)

  const handleBadClick = () => setBad(bad + 1)

  return (
      <>
        <h1>give feedback</h1>
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
        <h1>statistic</h1>
        <Statistics good = {good} neutral = {neutral} bad = {bad}/>
      </>
  )
}

export default App