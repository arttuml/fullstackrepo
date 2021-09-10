import React from 'react'

const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => {
  const total = parts.reduce( ( sum, part ) => sum + part.exercises ,0)
  return (
    <div>
      {parts.map(part => <Part key = {part.id} part = {part} />)}
      <b>total of {total} exercises</b>
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name = {course.name} />
      <Content parts = {course.parts} />
    </div>
  )
}

const Courses = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course => <Course key = {course.id} course = {course} />)}
    </div>
  )
}



const App = () => {


  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <Courses courses={courses} />
    </div>
  )
}


export default App
