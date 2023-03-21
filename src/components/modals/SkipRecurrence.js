import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  deleteCustomerOrder,
  editOrder,
  fetchCustomerOrders,
  removeItemFromCartById,
  resetCheckout,
  resetOrder,
  selectTimezone,
  setSubmitting,
  showNotification,
  submitOrder
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'
import { isoToDateStr } from '@open-tender/js'

import { ModalContent, ModalView } from '../Modal'
import { closeModal } from '../../slices'

const SkipRecurrence = ({ item, order }) => {
  const dispatch = useDispatch()
  const tz = useSelector(selectTimezone)

  const dateText = isoToDateStr(order.requested_at, tz, 'EEEE, MMMM dd')

  const skipRecurrence = async () => {
    await dispatch(editOrder(order, false))

    const cart = dispatch(removeItemFromCartById(item))
    if (cart.length === 0) {
      dispatch(deleteCustomerOrder(order.order_id))
      showNotification(
        `Your upcoming order on ${dateText} has been cancelled`
      )
    }
    else {
      dispatch(setSubmitting(true))
      await dispatch(submitOrder())

      dispatch(
        showNotification(
          `${item.name} was skipped on your upcoming order on ${dateText}`
        )
      )
    }
    dispatch(resetOrder())
    dispatch(resetCheckout())
    dispatch(fetchCustomerOrders())
  }

  return (
    <ModalView>
      <ModalContent
        title='Are you sure you want to skip this item?'
        subtitle={
          <>
            <p>
              {item.name} will be removed from the upcoming order on {dateText}.
            </p>
            <p>
              It will continue to be added to future recurring orders.
            </p>
          </>
        }
        footer={
          <div>
            <ButtonStyled onClick={skipRecurrence}>
              Skip This Item
            </ButtonStyled>
            <ButtonStyled
              onClick={() => dispatch(closeModal())}
              color='secondary'
            >
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
