import React from "react";

const Course = ({ course }) => {
    return (
      <div>
        <Header name = {course.name} />
        <Content parts = {course.parts} />
      </div>
    )
  }

  const Header = ({ name }) => <h2>{name}</h2>
  
  const Content = ({ parts }) => {
    const total = parts.reduce( ( sum, part ) => sum + part.exercises ,0)
    return (
      <div>
        {parts.map(part => <Part key = {part.id} part = {part} />)}
        <b>total of {total} exercises</b>
      </div>
    )
  }

  const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

export default Course