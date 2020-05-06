import React from 'react'
import propTypes from 'prop-types'
import { displayPrice } from './utils'
import BuilderQuantity from './BuilderQuantity'

const BuilderOption = ({
  group,
  option,
  adjust,
  increment,
  decrement,
  classes = '',
}) => {
  const groupAtMax = group.max !== 0 && group.quantity === group.max
  const optionAtMax = option.max !== 0 && option.quantity === option.max
  const incrementDisabled = groupAtMax || optionAtMax
  const groupAtMin = group.min !== 0 && group.quantity === group.min
  const optionAtMin = option.min !== 0 && option.quantity === option.min
  const decrementDisabled = groupAtMin || optionAtMin || option.quantity === 0
  return (
    <li>
      <span className="builder__option">
        <span className="builder__option__name">{option.name}</span>
        <span className="builder__option__price">
          ${displayPrice(option.price)}
        </span>
        <span className="builder__option__quantity">
          <BuilderQuantity
            item={option}
            adjust={adjust}
            increment={increment}
            decrement={decrement}
            incrementDisabled={incrementDisabled}
            decrementDisabled={decrementDisabled}
            classes={classes}
          />
        </span>
        <span className="builder__option__price">
          ${displayPrice(option.totalPrice)}
        </span>
      </span>
    </li>
  )
}

BuilderOption.displayName = 'BuilderOption'
BuilderOption.propTypes = {
  group: propTypes.object,
  option: propTypes.object,
  adjust: propTypes.func,
  increment: propTypes.func,
  decrement: propTypes.func,
  size: propTypes.number,
  classes: propTypes.string,
}

export default BuilderOption
