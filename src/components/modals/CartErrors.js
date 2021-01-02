import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectMenu, setCart, revertMenu } from '@open-tender/redux'
import { CartErrors as CartErrorsComponent } from '@open-tender/components'

import { closeModal, selectConfig } from '../../slices'
import iconMap from '../iconMap'
import { ModalContent, ModalView } from '..'

const CartErrors = () => {
  const dispatch = useDispatch()
  const { cartErrors, previousMenuVars, menuVars } = useSelector(selectMenu)
  const { newCart, errors } = cartErrors || {}
  const { menu } = useSelector(selectConfig)

  const handleRevert = (menuVars) => {
    dispatch(closeModal())
    dispatch(revertMenu(menuVars))
  }

  const handleProceed = () => {
    dispatch(setCart(newCart))
    dispatch(closeModal())
  }

  return (
    <ModalView>
      <ModalContent
        title={menu.cartErrors.title}
        subtitle={<p>{menu.cartErrors.subtitle}</p>}
      >
        <CartErrorsComponent
          newCart={newCart}
          errors={errors}
          revert={handleRevert}
          revertIcon={iconMap.ChevronLeft}
          proceed={handleProceed}
          proceedIcon={iconMap.Trash2}
          previousMenuVars={previousMenuVars}
          menuVars={menuVars}
        />
      </ModalContent>
    </ModalView>
  )
}

CartErrors.displayName = 'CartErrors'

export default CartErrors
