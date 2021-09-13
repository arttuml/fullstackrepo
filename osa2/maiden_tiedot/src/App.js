import React,{ useState, useEffect } from 'react'
import axios from 'axios'

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const Country = ({ country, handleClick }) => {
  console.log(country.name)
  return <><p>{country.name}</p><Button handleClick={handleClick(country.name)} text="show" /></>;
}

const CountryInfo = ({ country }) => (
  <div>
    <h1>{country.name}</h1>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h2>languages</h2> 
    <ul>{country.languages.map(language => <li>{language.name}</li>)}</ul>
    <img src={country.flag} width="10%" height="10%" alt='flag'/> 
  </div> 
)

const Countries = ({ countries, handleClick }) => {
  console.log(countries.length)
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />
  }
  return (
    <div>{countries.map(country => <Country key={country.name} country={country} handleClick ={handleClick}/>)}</div>
  )
}

const Filter = ({newFilter, handleFilterChange}) => (
  <div>find countries <input value={newFilter} onChange={handleFilterChange}/></div>
)

const App = () => {

  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all').then(response => {
        console.log(response.data)
        setCountries(response.data)
      })
  }, [])

  const countriesToShow  = countries.filter(country => country.name.toLowerCase().includes(newFilter.toLowerCase())) 

  const handleShowClick = (name) => {
    console.log(name, '2')
    const handler = () => setNewFilter(name)
      return handler
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div >
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <Countries countries={countriesToShow} handleClick={handleShowClick} />
    </div>
  );
}

export default App;
