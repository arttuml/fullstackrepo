import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addPerson = nameObject => {
    const request = axios.post(baseUrl, nameObject)
    return request.then(response => response.data)
}

const deletePerson = id => {
    console.log(`${baseUrl}/${id}`)
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const personService = { getAll, addPerson, deletePerson }

export default personService