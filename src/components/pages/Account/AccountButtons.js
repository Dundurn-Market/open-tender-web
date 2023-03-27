import styled from '@emotion/styled'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchCustomerOrders,
  resetOrder,
  selectOrder,
  selectCustomerOrders,
} from '@open-tender/redux'
import { ButtonLarge } from '../..'
import { ArrowRight } from '../../icons'
import React, { useEffect } from 'react'

export const AccountButtonsView = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: row-reverse;
  padding: 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: center;
    padding: ${(props) => props.theme.layout.paddingMobile};
    background-color: ${(props) => props.theme.bgColors.primary};
  }

  button {
    width: 25rem;
    max-width: calc(50% - 1rem);
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      margin: 0;
    }
  }

  button + button {
    margin: 0 2rem 0 0;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      margin: ${(props) => props.theme.layout.paddingMobile} 0 0;
  }
`

const AccountButtons = React.forwardRef((props, ref) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentOrder = useSelector(selectOrder)
  const { entities : orders } = useSelector(selectCustomerOrders)

  useEffect(() => {
    dispatch(fetchCustomerOrders(10))
  }, [dispatch])

  const { revenueCenter, serviceType, cart } = currentOrder
  const isCurrentOrder = revenueCenter && serviceType && cart.length > 0

  const editableOrders = orders.filter(i => i.is_editable)
  const existingOrders = !!editableOrders.length

  const continueCurrent = () => {
    navigate(revenueCenter ? `/menu/${revenueCenter.slug}` : '/order-type')
  }

  const startNewOrder = () => {
    dispatch(resetOrder())
    navigate(`/order-type`)
  }

  const editOrders = () => {
    navigate(`/orders`)
  }

  return (
    <AccountButtonsView ref={ref}>
      <>
        { existingOrders &&
          <ButtonLarge
            onClick={editOrders}
            text={'Edit an Order'}
            color="secondary"
          >
            <ArrowRight size={22} strokeWidth={2} />
          </ButtonLarge>
        }
        <ButtonLarge
          onClick={isCurrentOrder ? continueCurrent : startNewOrder}
          text={isCurrentOrder ? 'Continue Order' : 'New Order'}
          color="primary"
        >
          <ArrowRight size={22} strokeWidth={2} />
        </ButtonLarge>
      </>
    </AccountButtonsView>
  )
})

AccountButtons.displayName = 'AccountButtons'

export default AccountButtons
