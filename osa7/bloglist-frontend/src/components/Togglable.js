import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="btn btn-primary btn-lg btn-block">
      <div style={hideWhenVisible}>
        <Button variant="primary" size="lg" onClick={toggleVisibility}>{props.buttonlabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button variant="secondary" onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  buttonlabel: PropTypes.string.isRequired
}

export default Togglable