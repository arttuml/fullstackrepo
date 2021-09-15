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
    {personsToShow.map(person => <Person key={person.name} person={person} deleteClick={() => deleteClick(person.id)}/>)}
  </div>
)

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  
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

  const handleDeleteClick = (id) => {
    console.log(`${id} delete button clicked`)
    personService
      .deletePerson(id)
      .then(returnedThing => {
        setPersons(persons.filter(n => n.id !== id))
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === newName)){
      window.alert(`${newName} is already added to phonebook`)
      console.log({})
    } else {
      personService
        .addPerson(nameObject)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
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