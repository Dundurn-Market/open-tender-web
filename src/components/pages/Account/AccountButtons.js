import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import { resetOrder, selectOrder } from '@open-tender/redux'
import { Body, ButtonStyled, Heading } from '@open-tender/components'

import styled from '@emotion/styled'
import { ArrowRight, PlusCircle } from 'react-feather'

const AccountButtonsView = styled('div')`
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
  margin: 0 0 4rem;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 0;
    position: fixed;
    z-index: 10;
    // left: ${(props) => props.theme.layout.paddingMobile};
    // right: ${(props) => props.theme.layout.paddingMobile};
    // bottom: ${(props) => props.theme.layout.paddingMobile};
    left: 0;
    right: 0;
    bottom: 0;
    padding: ${(props) => props.theme.layout.paddingMobile};
    background-color: ${(props) => props.theme.bgColors.primary};
  }

  button {
    min-width: 16rem;
    margin: 0 1rem 0 0;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      width: 100%;
      min-width: 100%;
      margin: 0;
    }
  }

  button + button {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      margin: ${(props) => props.theme.layout.paddingMobile} 0 0;
  }
`

const AccountButtonContent = styled.span`
  width: 100%;
  height: 2.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    display: block;
  }
`

const AccountButtonContentPrimary = styled(Heading)`
  transition: ${(props) => props.theme.links.transition};
  color: ${(props) => props.theme.buttons.colors.primary.color};

  &:hover {
    color: ${(props) => props.theme.buttons.colors.primaryHover.color};
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      color: ${(props) => props.theme.buttons.colors.primary.color};
    }
  }
`

const AccountButtonContentSecondary = styled(Body)`
  transition: ${(props) => props.theme.links.transition};
  color: ${(props) => props.theme.buttons.colors.secondary.color};

  &:hover {
    color: ${(props) => props.theme.buttons.colors.secondaryHover.color};
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      color: ${(props) => props.theme.buttons.colors.secondary.color};
    }
  }
`

const AccountButtons = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentOrder = useSelector(selectOrder)
  const { revenueCenter, serviceType, cart } = currentOrder
  const isCurrentOrder = revenueCenter && serviceType && cart.length > 0
  const buttonSize = isBrowser ? 'big' : 'big'

  const continueCurrent = () => {
    navigate(revenueCenter ? `/menu/${revenueCenter.slug}` : '/order-type')
  }

  const startNewOrder = () => {
    dispatch(resetOrder())
    navigate(`/order-type`)
  }

  return (
    <AccountButtonsView>
      {isCurrentOrder && (
        <ButtonStyled
          onClick={startNewOrder}
          size={buttonSize}
          color="secondary"
        >
          <AccountButtonContent>
            <AccountButtonContentSecondary>
              New Order
            </AccountButtonContentSecondary>
            <PlusCircle size={22} strokeWidth={1} />
          </AccountButtonContent>
        </ButtonStyled>
      )}
      <ButtonStyled
        onClick={isCurrentOrder ? continueCurrent : startNewOrder}
        size={buttonSize}
        color="primary"
      >
        <AccountButtonContent>
          <AccountButtonContentPrimary>
            {isCurrentOrder ? 'Continue Order' : 'Order Now'}
          </AccountButtonContentPrimary>
          <ArrowRight size={22} />
        </AccountButtonContent>
      </ButtonStyled>
    </AccountButtonsView>
  )
}

AccountButtons.displayName = 'AccountButtons'

export default AccountButtons
