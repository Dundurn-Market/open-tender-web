import React from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'

import { Reward } from '.'

const DealsView = styled('div')`
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
  margin: -1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    margin: -0.5rem;
    justify-content: center;
  }
`

const Deal = styled('div')`
  width: 33.33333%;
  padding: 1rem;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    width: 50%;
    padding: 0.5rem;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    padding: 0.5rem;
  }
`

const Deals = ({ deals }) => {
  return (
    <DealsView>
      {deals.map((deal) => (
        <Deal key={deal.discount_id}>
          <Reward item={deal} />
        </Deal>
      ))}
    </DealsView>
  )
}

Deals.displayName = 'Deals'
Deals.propTypes = {
  deals: propTypes.array,
}

export default Deals
