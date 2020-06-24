import React from 'react'
import propTypes from 'prop-types'
import Button from './Button'

const makeIcon = (serviceType) => {
  switch (serviceType) {
    case 'OUTPOST':
      return 'MapPin'
    case 'DELIVERY':
      return 'Truck'
    default:
      return 'ShoppingBag'
  }
}

const ButtonServiceType = ({
  serviceType,
  serviceTypeName,
  onClick,
  classes = 'btn',
}) => {
  return (
    <Button
      text={serviceTypeName}
      ariaLabel={`Change service type from ${serviceTypeName}`}
      icon={makeIcon(serviceType)}
      classes={classes}
      onClick={onClick}
    />
  )
}

ButtonServiceType.displayName = 'ButtonServiceType'
ButtonServiceType.propTypes = {
  serviceType: propTypes.string,
  onClick: propTypes.func,
  classes: propTypes.string,
}

export default ButtonServiceType
