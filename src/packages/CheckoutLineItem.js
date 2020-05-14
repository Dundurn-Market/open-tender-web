import React from 'react'
import propTypes from 'prop-types'

const CheckoutLineItem = ({ label, classes = '', children }) => {
  return (
    <div className={`form__line border-color ${classes}`}>
      <div className="form__line__label">{label}</div>
      <div className="form__line__value">{children}</div>
    </div>
  )
}

CheckoutLineItem.displayName = 'CheckoutLineItem'
CheckoutLineItem.propTypes = {
  label: propTypes.string,
  classes: propTypes.string,
}

export default CheckoutLineItem
