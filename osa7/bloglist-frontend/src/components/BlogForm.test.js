import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const author = component.container.querySelector('#author')
  const title = component.container.querySelector('#title')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')


  fireEvent.change(author, {
    target: { value: 'Timo Testaaja' }
  })
  fireEvent.change(title, {
    target: { value: 'Testi blogi' }
  })
  fireEvent.change(url, {
    target: { value: 'https://testiblogi.fi/' }
  })

  fireEvent.submit(form)



  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].author).toBe('Timo Testaaja' )
  expect(createBlog.mock.calls[0][0].title).toBe('Testi blogi' )
  expect(createBlog.mock.calls[0][0].url).toBe('https://testiblogi.fi/' )
})