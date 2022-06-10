import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import { resetOrder, selectOrder } from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'

import styled from '@emotion/styled'
import { openModal } from '../../../slices'

const GuestButtonsView = styled('div')`
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    position: fixed;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 2rem ${(props) => props.theme.layout.paddingMobile} 2rem;
    background-color: ${(props) => props.theme.bgColors.primary};
    box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.06), 0 -2px 4px rgba(0, 0, 0, 0.05);
  }
`

const GuestButtonsContainer = styled.div`
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-width: 40rem;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button {
    min-width: 16rem;
    margin: 0 1rem 0 0;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      width: 48%;
      min-width: 0;
      padding-left: 0;
      padding-right: 0;
      margin: 0;
    }
  }
`

const GuestButtons = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentOrder = useSelector(selectOrder)
  const { revenueCenter, serviceType, cart } = currentOrder
  const isCurrentOrder = revenueCenter && serviceType && cart.length > 0
  const buttonSize = isBrowser ? 'default' : 'default'

  const continueCurrent = () => {
    navigate(revenueCenter ? `/menu/${revenueCenter.slug}` : '/order-type')
  }

  const startNewOrder = () => {
    dispatch(resetOrder())
    navigate(`/order-type`)
  }

  const login = () => {
    dispatch(openModal({ type: 'login' }))
  }

  return (
    <GuestButtonsView>
      <GuestButtonsContainer>
        <ButtonStyled
          onClick={isCurrentOrder ? continueCurrent : startNewOrder}
          size={buttonSize}
          color="primary"
        >
          {isCurrentOrder ? 'Continue Order' : 'New Order'}
        </ButtonStyled>
        <ButtonStyled onClick={login} size={buttonSize} color="secondary">
          Login / Sign Up
        </ButtonStyled>
      </GuestButtonsContainer>
    </GuestButtonsView>
  )
}

GuestButtons.displayName = 'GuestButtons'

export default GuestButtons