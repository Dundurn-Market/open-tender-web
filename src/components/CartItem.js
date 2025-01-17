import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import {
  decrementItemInCart,
  incrementItemInCart,
  selectCustomer,
  selectCustomerFavorites,
  setCartItemFrequency,
  selectOrder,
} from '@open-tender/redux'
import {
  formatDollars,
  makeItemSignature,
  makeModifierNames,
} from '@open-tender/js'
import { BgImage, Body, ButtonLink, Heading, SelectOnly } from '@open-tender/components'
import { MenuItemFavorite, Quantity } from '.'
import { subscriptionFreqOptions } from '../utils/recurringFrequencyUtils'
import OrderFrequency from './buttons/OrderFrequency'

const CartItemView = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 1.5rem 0;
  border-bottom-style: solid;
  border-bottom-width: ${(props) => props.theme.border.width};
  border-bottom-color: ${(props) => props.theme.border.color};

  &:last-of-type {
    border: 0;
  }
`

const CartItemImage = styled(BgImage)`
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  border-radius: ${(props) => props.theme.border.radiusSmall};
  background-color: ${(props) => props.theme.bgColors.tertiary};
`

const CartItemInfo = styled.span`
  display: block;
  flex-grow: 1;
  padding: 0 1.75rem;
`

const CartItemName = styled(Heading)`
  display: block;
  font-size: ${(props) => props.theme.fonts.sizes.small};
`

const CartItemDescription = styled(Body)`
  display: block;
  margin-top: 0.3rem;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
`

const CartItemMadeFor = styled.span`
  display: block;
  margin-top: 0.2rem;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  color: ${(props) => props.theme.colors.primary};
`

const CartItemDetails = styled.span`
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
`

const CartItemFrequency = styled.div`
  width: 7.5rem;
  margin: 0.4rem 1.5rem 0;
  flex-shrink: .1;

  select {
    padding-right: 0;
    border-bottom: 0;
  }
  select:focus {
    outline: none;
  }
`

const CartItemPrice = styled(Heading)`
  display: block;
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  }
`

const CartItemLink = styled.span`
  display: block;
  margin-left: 1.5rem;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
`

const CartItemQuantity = styled.div`
  width: 9.2rem;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const CartItemFavorite = styled.div`
  align-self: center;
  margin-top: 1rem;
`

const CartItem = ({ item, editItem, removeItem }) => {
  const dispatch = useDispatch()
  const { name, quantity, max, totalPrice, imageUrl, madeFor, frequency = 'SINGLE'} = item
  const bgStyle = imageUrl ? { backgroundImage: `url(${imageUrl}` } : null
  const desc = makeModifierNames(item)
  const { auth } = useSelector(selectCustomer)
  const { lookup } = useSelector(selectCustomerFavorites)
  const { revenueCenter, serviceType } = useSelector(selectOrder)
  const signature =
    item.favorite && item.favorite.favorite_id ? null : makeItemSignature(item)
  const favoriteId =
    item.favorite && item.favorite.favorite_id
      ? item.favorite.favorite_id
      : lookup && signature
      ? lookup[signature]
      : null

  const setFrequency = (event) => {
    dispatch(setCartItemFrequency({...item, frequency: event.target.value}))
  }

  const showFreq = !!revenueCenter?.order_times?.[serviceType.toUpperCase()]

  return (
    <CartItemView>
      <CartItemImage as="span" style={bgStyle} />
      <CartItemInfo>
        <CartItemName>{name}</CartItemName>
        {desc && <CartItemDescription>{desc}</CartItemDescription>}
        {madeFor && (
          <CartItemMadeFor>
            For <span>{madeFor}</span>
          </CartItemMadeFor>
        )}
        <CartItemDetails>
          <CartItemPrice>{formatDollars(totalPrice)}</CartItemPrice>
          <CartItemLink>
            <ButtonLink onClick={editItem}>edit</ButtonLink>
          </CartItemLink>
          <CartItemLink>
            <ButtonLink onClick={removeItem}>remove</ButtonLink>
          </CartItemLink>
        </CartItemDetails>
      </CartItemInfo>
      {showFreq &&
        <CartItemFrequency>
          <OrderFrequency
            orderFrequency={frequency}
            setOrderFrequency={setFrequency}
            shortOptions={true}
          />
        </CartItemFrequency>
      }
      <CartItemQuantity>
        <Quantity
          item={item}
          increment={() => dispatch(incrementItemInCart(item))}
          decrement={() => dispatch(decrementItemInCart(item))}
          incrementDisabled={quantity === max}
          decrementDisabled={false}
        />
        {auth && (
          <CartItemFavorite>
            <MenuItemFavorite
              size={16}
              builtItem={item}
              favoriteId={favoriteId}
            />
          </CartItemFavorite>
        )}
      </CartItemQuantity>
    </CartItemView>
  )
}

CartItem.displayName = 'CartItem'
CartItem.propTypes = {
  item: propTypes.object,
  editItem: propTypes.func,
  removeItem: propTypes.func,
}

export default CartItem
