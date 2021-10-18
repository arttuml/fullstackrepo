import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
  let blog
  let component
  let updateBlog
  let removeBlog

  beforeEach(() => {
    blog = {
      user: {
        username: 'Testaaja',
        name: 'Timo Testaaja',
        id:'user.id.148sdf6a87f78aa787'
      },
      title: 'Testi blogin otsikko',
      author: 'Testi Blogaaja',
      url: 'https://blogi.fi/',
      likes: 666,
      id: 'blog.id.9d8sf798sdf8s7dfssdf79'
    }

    const user = blog.user

    removeBlog = jest.fn()
    updateBlog = jest.fn()
    component = render(
      <Blog blog={blog} user={user} removeBlog={removeBlog} updateBlog={updateBlog} />
    )
  })

  test('renders content', () => {

    const div = component.container.querySelector('.blogInfo')
    const secondDiv = component.container.querySelector('.moreBlogInfo')

    expect(div).not.toHaveStyle('display: none')
    expect(secondDiv).toHaveStyle('display: none')

    expect(div).toHaveTextContent(
      'Testi Blogaaja','Testi blogin otsikko'
    )
  })

  test('after clicking the view button, more info are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const secondDiv = component.container.querySelector('.moreBlogInfo')
    expect(secondDiv).not.toHaveStyle('display: none')

  })

  test('after clicking the like button function has been called', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })

})

