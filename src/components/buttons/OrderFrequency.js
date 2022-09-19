import propTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  addMessage,
  selectOrderFrequency, setAlert,
  setDefaultOrderFrequency
} from '@open-tender/redux'
import { SelectOnly } from '@open-tender/components'
import styled from '@emotion/styled'
const OrderFrequencyDropdown = styled.div`
  flex-grow: 0;
  width: 8rem;
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
    dispatch(addMessage('You just updated your global order frequency! You can still alter the frequency for individual items in the menu.'))
  }

  return (
    <OrderFrequencyDropdown>
      <SelectOnly
        label='Subscribe'
        name='subscription-freq'
        value={orderFrequency}
        onChange={setOrderFrequency}
        options={subscriptionFreqOptions}
      />
    </OrderFrequencyDropdown>
  )
}

OrderFrequency.displayName = 'OrderFrequency'
OrderFrequency.propTypes = {
  style: propTypes.object,
  useButton: propTypes.bool,
}

export const subscriptionFreqOptions = [
  {name: '1 time', value: 'SINGLE'},
  {name: 'Weekly', value: 'WEEKLY'},
  {name: 'Bi-weekly', value: 'BIWEEKLY'},
  {name: 'Monthly', value: 'MONTHLY'},
]

export default OrderFrequency
