import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import { selectOrder, selectCartQuantity } from '@open-tender/redux'
import { contains } from '@open-tender/js'
import { toggleSidebar } from '../../slices'
import { ShoppingBag } from '../icons'
import Icon from './Icon'

const CartIcon = styled.div`
  position: relative;
  margin: 0;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 0 -1rem 0 0.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 0 -1rem 0 0;
  }

  button {
    // margin: -0.2rem 0 0;

    &:hover,
    &:active,
    &:focus {
      color: ${(props) => props.theme.colors.primary};
  }
`

const CartCount = styled.div`
  position: absolute;
  z-index: 1;
  top: 0.5rem;
  right: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 1.7rem;
  height: 1.7rem;
  border-radius: 1.2rem;
  padding-bottom: 0.1rem;
  font-size: ${(props) => props.theme.fonts.sizes.xxSmall};
  color: ${(props) => props.theme.counts.alerts.color};
  background-color: ${(props) => props.theme.counts.alerts.bgColor};
`

const Cart = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { pathname } = useLocation()
  const cartQuantity = useSelector(selectCartQuantity)
  const currentOrder = useSelector(selectOrder)
  const { revenueCenter, serviceType } = currentOrder
  const isCurrentOrder = revenueCenter && serviceType && cartQuantity > 0
  const fill = isCurrentOrder ? theme.colors.alert : 'transparent'
  const hideCart = contains(pathname, ['/item/', 'review'])
  const showCart =
    (isCurrentOrder || contains(pathname, ['menu', 'checkout'])) && !hideCart

  return showCart ? (
    <CartIcon>
      {cartQuantity > 0 && <CartCount>{cartQuantity}</CartCount>}
      <Icon onClick={() => dispatch(toggleSidebar())}>
        <ShoppingBag size={isBrowser ? 24 : 24} fill={fill} />
      </Icon>
    </CartIcon>
  ) : null
}

Cart.displayName = 'Cart'

export default Cart
