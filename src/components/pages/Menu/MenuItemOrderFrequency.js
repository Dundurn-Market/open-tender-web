import styled from '@emotion/styled'
import { SelectOnly } from '@open-tender/components'
import { subscriptionFreqOptions } from '../../../utils/recurringFrequencyUtils'
import { useState } from 'react'
import { string } from 'prop-types'


const MenuItemSubscriptionDropdown = styled.div`
  width: 25%;

  select {
    padding-left: 5px;
    padding-right: 0;
  }

  select:focus {
    outline: none;
  }
`
const MenuItemOrderFrequency = ({ orderFrequency }) => {

  const setSubscription = (event) => {
    setOrderFreq(event.target.value)
  }

  const [orderFreq, setOrderFreq] = useState(orderFrequency)
  return (
    <MenuItemSubscriptionDropdown>
      <SelectOnly
        label='Subscribe'
        name='subscription-freq'
        value={orderFreq}
        onChange={setSubscription}
        options={subscriptionFreqOptions}
      />
    </MenuItemSubscriptionDropdown>
  )
}

MenuItemOrderFrequency.displayName = 'MenuItemOrderFrequency'

MenuItemOrderFrequency.propTypes = {
  orderFrequency: string
}

export default MenuItemOrderFrequency