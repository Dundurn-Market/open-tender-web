import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  setCurrentItem,
  selectCart,
  removeItemFromCart,
  selectOrder,
  selectMenuSlug,
} from '@open-tender/redux'
import { slugify } from '@open-tender/js'
import {
  openModal,
  // selectDisplaySettings,
  toggleSidebar,
  toggleSidebarModal,
} from '../slices'
import CartItem from './CartItem'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector(selectCart)
  const menuSlug = useSelector(selectMenuSlug)
  const { revenueCenter, serviceType } = useSelector(selectOrder)
  // const displaySettings = useSelector(selectDisplaySettings)
  // const { builderType } = displaySettings
  const builderType = 'PAGE'

  useEffect(() => {
    if (revenueCenter?.order_times?.[serviceType.toUpperCase()]) return
    if (cart.some(item => !!item.frequency)) {
      dispatch(openModal({ type: 'recurrenceErrors', args: {} }))
    }
  }, [cart, revenueCenter])

  const editItem = (item) => {
    dispatch(setCurrentItem(item))
    if (builderType === 'PAGE') {
      dispatch(toggleSidebar())
      const frequencyVar = item.frequency? `?freq=${item.frequency}`:''
      navigate(`${menuSlug}/item/${slugify(item.name)}${frequencyVar}`)
    } else if (builderType === 'SIDEBAR') {
      dispatch(toggleSidebarModal())
    } else {
      dispatch(openModal({ type: 'item', args: { focusFirst: true } }))
    }
  }

  const removeItem = (item) => {
    dispatch(removeItemFromCart(item))
  }

  return cart && cart.length
    ? cart.map((item, index) => {
        return (
          <CartItem
            key={`${item.id}-${index}`}
            item={item}
            editItem={() => editItem(item)}
            removeItem={() => removeItem(item)}
          />
        )
      })
    : null
}

Cart.displayName = 'Cart'

export default Cart
