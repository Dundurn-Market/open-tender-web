import React from 'react'
import propTypes from 'prop-types'
import Button from './Button'
import { makeFullAddress } from './utils/cart'

const ButtonAddress = ({ address, onClick, classes = 'btn' }) => {
  if (!address) return null
  const fullAddresss = makeFullAddress(address)
  return (
    <Button
      text={fullAddresss}
      ariaLabel={`Current address: ${fullAddresss}. Click to update.`}
      icon="Navigation"
      classes={classes}
      onClick={onClick}
    />
  )
}

ButtonAddress.displayName = 'ButtonAddress'
ButtonAddress.propTypes = {
  revenueCenter: propTypes.object,
  onClick: propTypes.func,
  classes: propTypes.string,
}

export default ButtonAddress
