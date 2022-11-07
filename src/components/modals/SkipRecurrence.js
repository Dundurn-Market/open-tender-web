import { ModalContent, ModalView } from '../Modal'
import { ButtonStyled } from '@open-tender/components'
import { closeModal, toggleSidebar } from '../../slices'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addItemToCart, deleteCustomerOrder,
  editOrder, incrementItemInCart,
  removeItemFromCartById, resetCheckout,
  resetOrder, selectCart, selectOrder,
  selectTimezone,
  setSubmitting, showNotification,
  submitOrder
} from '@open-tender/redux'
import { isoToDateStr } from '@open-tender/js'


const SkipRecurrence = ({ recurrence, order }) => {
  const tz = useSelector(selectTimezone)
  const readableDate = isoToDateStr(order.requested_at, tz, 'EEEE, MMMM dd')
  const dispatch = useDispatch()

  const toggleSkipRecurrence = async () => {
    await dispatch(editOrder(order, false))

    if (recurrence.isSkipped) {
      dispatch(addItemToCart(
        {...recurrence.item,
          groups: [],
          quantity: recurrence.quantity,
          frequency: recurrence.frequency,
          recurrence_id: recurrence.id
        }))

    } else {
      const cart = dispatch(removeItemFromCartById(recurrence.item))

      if (cart.length === 0) {
        dispatch(deleteCustomerOrder(order.order_id))
      }
    }

    dispatch(setSubmitting(true))
    await dispatch(submitOrder())

    dispatch(showNotification(`${recurrence.item.name} was ${recurrence.isSkipped?'re-added to':'skipped on'} your upcoming order on ${readableDate}`))
    dispatch(resetOrder())
    dispatch(resetCheckout())
  }

  return (
    <ModalView>
      <ModalContent
        title={`Are you sure you want to ${recurrence.isSkipped? 'un-skip':'skip'} this item in the next order?`}
        subtitle={
          <>
            <p>
              {recurrence.item.name} will be {recurrence.isSkipped? 're-added to':'removed from'} the upcoming order on {readableDate}.
            </p>
            { !recurrence.isSkipped &&
              <p>
                It will continue to be added to future recurring orders.
              </p>
            }
          </>
        }
        footer={
          <div>
            <ButtonStyled onClick={toggleSkipRecurrence}>
              {recurrence.isSkipped && 'Un-'}Skip This Item
            </ButtonStyled>
            <ButtonStyled onClick={() => dispatch(closeModal())} color='secondary'>
              Cancel
            </ButtonStyled>
          </div>
        }
      >
      </ModalContent>
    </ModalView>
  )
}

SkipRecurrence.displayName = 'SkipRecurrence'
export default SkipRecurrence