import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = ({person, deleteClick }) => (
  <p>{person.name} {person.number} <button onClick={deleteClick}>delete</button></p>
)

const Filter = ({newFilter, handleFilterChange}) => (
  <div>filter shown with <input value={newFilter} onChange={handleFilterChange}/></div>
)

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => (
  <form onSubmit={addPerson}>
    <div>name: <input value={newName} onChange={handleNameChange}/></div>
    <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ personsToShow, deleteClick }) => (
  <div>
    {personsToShow.map(person => <Person key={person.name} person={person} deleteClick={() => deleteClick(person)}/>)}
  </div>
)

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="message">
      {message}
    </div>
  )
}

const ErrorNotification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }
  return (
    <div className="error">
      {errorMessage}
    </div>
  )

}


const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)
  
  useEffect(() =>{
    personService
      .getAll()
      .then(persons =>{
        setPersons(persons)
      })
  },[])

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const handleDeleteClick = (person) => {
    console.log(`${person.id} delete button clicked`)
    if (window.confirm(`delete ${person.name}?`)) {
      personService
      .deletePerson(person.id)
      .then(returnedThing => {
        setPersons(persons.filter(n => n.id !== person.id))
        setMessage(
          `${person.name}'s number has been deleted`
          )
        setTimeout(() => {
            setMessage(null)
          }, 2000)
      })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === newName)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {

        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}

        personService
          .updateNumber(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            console.log(returnedPerson)
            setNewName('')
            setNewNumber('')
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : changedPerson ))
            setMessage(
              `${returnedPerson.name}'s number has been updated`
              )
            setTimeout(() => {
                setMessage(null)
              }, 2000)
          })
          .catch(error =>{
            setPersons(persons.filter(n => n.id !== changedPerson.id))
            setErrorMessage(
              `Information of ${changedPerson.name} has already been removed from server`
              )
            setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            console.log('fail')
          })
      }
    } else {
      personService
        .addPerson(nameObject)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(
            `Added ${returnedPerson.name}`
            )
          setTimeout(() => {
              setMessage(null)
            }, 2000)
        })
        .catch(error => {
          const message = error.response.data.error
          setErrorMessage(message)
          setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <ErrorNotification errorMessage={errorMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
      addPerson={addPerson}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange} 
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deleteClick={handleDeleteClick} />
    </div>
  )

}

export default App