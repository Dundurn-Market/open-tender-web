import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import styled from '@emotion/styled'
import { contains } from '@open-tender/js'
import { selectCartQuantity, selectOrder } from '@open-tender/redux'
import { toggleSidebar } from '../slices'
import { ShoppingBag } from './icons'

const CartButtonView = styled.div`
  position: fixed;
  z-index: 10;
  bottom: ${isMobile ? '80px' : '20px'};
  right: ${(props) => isMobile ? props.theme.layout.padding : '80px'};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    right: ${(props) => props.theme.layout.paddingMobile};
    // bottom: 6rem;
  }
`

const CartButtonContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${isMobile ? '48px' : '8rem'};
  height:${isMobile ? '48px' : '8rem'};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: ${isMobile ? '48px' : '7rem'};
    height: ${isMobile ? '48px' : '7rem'};
  }
`

const CartButtonButton = styled.button`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  text-align: center;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.5);
  color: ${(props) => props.theme.buttons.colors.cart.color};
  background-color: ${(props) => props.theme.buttons.colors.cart.bgColor};
  border-color: ${(props) => props.theme.buttons.colors.cart.borderColor};

  &:hover,
  &:active {
    color: ${(props) => props.theme.buttons.colors.cartHover.color};
    background-color: ${(props) =>
      props.theme.buttons.colors.cartHover.bgColor};
    border-color: ${(props) =>
      props.theme.buttons.colors.cartHover.borderColor};
  }

  &:focus {
    outline: none;
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.5);
  }

  &:disabled {
    color: ${(props) => props.theme.buttons.colors.cart.color};
    background-color: ${(props) => props.theme.buttons.colors.cart.bgColor};
    border-color: ${(props) => props.theme.buttons.colors.cart.borderColor};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.5);
  }
`

const CartButtonIcon = styled.div`
  width: 3rem;
  height: 3rem;
  margin: 0 auto;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 2.4rem;
    height: 2.4rem;
  }
`

const CartButtonCount = styled.div`
  position: absolute;
  top: -0.3rem;
  right: -0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 2.6rem;
  height: 2.6rem;
  border-radius: 1.3rem;
  border-style: solid;
  border-width: ${(props) => props.theme.counts.alerts.borderWidth};
  padding-top: ${(props) => props.theme.counts.alerts.paddingTop};
  padding-bottom: ${(props) => props.theme.counts.alerts.paddingBottom};
  color: ${(props) => props.theme.counts.alerts.color};
  background-color: ${(props) => props.theme.counts.alerts.bgColor};
  border-color: ${(props) => props.theme.counts.alerts.borderColor};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    top: -0.2rem;
    right: -0.2rem;
    min-width: 2.4rem;
    height: 2.4rem;
  }

  span {
    display: block;
    line-height: 0;
    font-family: ${(props) => props.theme.counts.alerts.family};
    font-weight: ${(props) => props.theme.counts.alerts.weight};
    font-size: ${(props) => props.theme.counts.alerts.fontSize};
    -webkit-font-smoothing: ${(props) =>
      props.theme.counts.alerts.fontSmoothing};
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.counts.alerts.fontSizeMobile};
    }
  }
`

const CartButton = () => {
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const cartQuantity = useSelector(selectCartQuantity)
  const { revenueCenter, serviceType, cart } = useSelector(selectOrder)
  const isCurrentOrder = revenueCenter && serviceType && cart.length > 0
  const isItem = pathname.includes('/item/')
  const notOrdering = pathname === '/menu' && !isCurrentOrder
  const showCart = contains(pathname, ['menu']) && !isItem && !notOrdering

  const toggle = (evt) => {
    evt.preventDefault()
    dispatch(toggleSidebar())
  }

  return showCart ? (
    <CartButtonView role="region">
      <CartButtonContainer>
        {cartQuantity > 0 && (
          <CartButtonCount>
            <span>{cartQuantity}</span>
          </CartButtonCount>
        )}
        <CartButtonButton
          onClick={toggle}
          aria-label="Open cart to review order, press escape key to access at any time"
        >
          <CartButtonIcon>
            <ShoppingBag />
          </CartButtonIcon>
        </CartButtonButton>
      </CartButtonContainer>
    </CartButtonView>
  ) : null
}

CartButton.displayName = 'CartButton'

export default CartButton
