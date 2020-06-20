import React from 'react'
import propTypes from 'prop-types'
import Button from './Button'

const ButtonCancelEdit = ({ orderId, onClick, classes = 'btn' }) => {
  return (
    <Button
      text="Cancel Edit"
      ariaLabel={`Cancel editing order ${orderId}`}
      icon="XCircle"
      classes={classes}
      onClick={onClick}
    />
  )
}

ButtonCancelEdit.displayName = 'ButtonCancelEdit'
ButtonCancelEdit.propTypes = {
  onClick: propTypes.func,
  classes: propTypes.string,
}

export default ButtonCancelEdit
