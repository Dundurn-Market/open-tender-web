import propTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectOrderFrequency,
  setDefaultOrderFrequency, showNotification
} from '@open-tender/redux'
import { SelectOnly } from '@open-tender/components'
import styled from '@emotion/styled'
import { subscriptionFreqOptions } from '../../utils/recurringFrequencyUtils'
const OrderFrequencyDropdown = styled.div`
  flex-grow: 0;
  width: 11.5rem;
  select, select:focus {
    border-bottom: none;
    outline: none;
  }
`

const OrderFrequency = () => {
  const dispatch = useDispatch()
  const orderFrequency = useSelector(selectOrderFrequency)

  const setOrderFrequency = (event) => {
    dispatch(setDefaultOrderFrequency(event.target.value))
    dispatch(showNotification('You just updated your global order frequency! ' +
      'You can still alter the frequency for individual items in the menu.'))
  }

  return (
    <OrderFrequencyDropdown>
      <SelectOnly
        label='Subscribe'
        name='subscription-freq'
        value={orderFrequency}
        onChange={setOrderFrequency}
        options={subscriptionFreqOptions.map((opt) => {return {name: opt.longName, value: opt.value}})}
      />
    </OrderFrequencyDropdown>
  )
}

OrderFrequency.displayName = 'OrderFrequency'
OrderFrequency.propTypes = {
  style: propTypes.object,
  useButton: propTypes.bool,
}

export default OrderFrequency
