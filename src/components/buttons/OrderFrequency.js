import propTypes from 'prop-types'
import styled from '@emotion/styled'

import { SelectOnly } from '@open-tender/components'

import { subscriptionFreqOptions } from '../../utils/recurringFrequencyUtils'

const OrderFrequencyDropdown = styled.div`
  flex-grow: 0;
  width: 100%;
  max-width: 12rem;

  select, select:focus {
    border-bottom: none;
    outline: none;
  }

  > span > span {
    padding: 0.5rem 0 0;
  }

  > span > select {
    padding: 0.5rem 0;
  }
`

const OrderFrequency = ({
  orderFrequency,
  setOrderFrequency,
  shortOptions = false,
}) => {
  const options = subscriptionFreqOptions.map(
    (opt) => ({
      name: shortOptions ? opt.name : opt.longName,
      value: opt.value,
    })
  )

  return (
    <OrderFrequencyDropdown>
      <SelectOnly
        label='Subscribe'
        name='subscription-freq'
        value={orderFrequency}
        onChange={setOrderFrequency}
        options={options}
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
