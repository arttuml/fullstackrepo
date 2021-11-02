import React from 'react'
import userService from '../services/users'

const Users = () => {
  const users = userService.getAll()
  console.log(users)
  console.log('lalala')
  return (
    <div>
      <p>lalal</p>
    </div>
  )
}

export default Users