import { ModalContent, ModalView } from '../Modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteCustomerOrder,
  editOrder,
  removeItemFromCartById,
  removeRecurrence, resetCheckout, resetOrder, selectCart,
  selectTimezone,
  setSubmitting,
  submitOrder
} from '@open-tender/redux'
import { isoToDateStr } from '@open-tender/js'
import { ButtonStyled } from '@open-tender/components'
import { closeModal, toggleSidebar } from '../../slices'

const DeleteRecurrence = ({recurrence, order}) => {

  const dispatch = useDispatch()

  const tz = useSelector(selectTimezone)
  const readableDate = isoToDateStr(order? order.requested_at : recurrence.renewed_at, tz, 'EEEE, MMMM dd')

  const isDeletable = (order && order.is_editable && !recurrence.isSkipped)

  const deleteOrderAndRecurrence = async () => {
    await dispatch(editOrder(order, false))

    const cart = dispatch(removeItemFromCartById(recurrence.item))

    if (cart.length !== 0) {
      dispatch(setSubmitting(true))
      dispatch(submitOrder())
    } else {
      dispatch(deleteCustomerOrder(order.order_id))
    }
    //TODO check if this was successful first, before deleting recurrence

    deleteRecurrence(recurrence)

    dispatch(resetOrder())
    dispatch(resetCheckout())
  }

  const deleteRecurrence = () => {
    dispatch(removeRecurrence(recurrence.id, null))
    dispatch(closeModal())
  }

  return (
    <ModalView>
      <ModalContent
        title="Delete Subscription?"
        subtitle={isDeletable? (
          <p>
            Would you also like to remove {recurrence.item.name} from your upcoming order scheduled for {readableDate}
          </p>
        ) : recurrence.isSkipped ? (
          <>
            <p>{recurrence.item.name} has already been skipped for this order.</p>
            <p>Delete your subscription to {recurrence.item.name} to remove the item from all future orders</p>
          </>
        ): order ? (
          <>
            <p>Your upcoming order on {readableDate} containing {recurrence.item.name} is no longer editable.</p>
            <p>Delete your subscription to remove the item from all future orders</p>
          </>
        ): (
          <p>
            This subscription is not connected to an upcoming order.
          </p>
        )}
        footer={isDeletable ? (
          <div>
            <ButtonStyled onClick={deleteOrderAndRecurrence}>
              Delete and remove from upcoming order
            </ButtonStyled>
            <ButtonStyled onClick={deleteRecurrence} color='secondary'>
              Delete and keep item in upcoming order
            </ButtonStyled>
            <ButtonStyled onClick={() => dispatch(closeModal())} color='secondary'>
              Nevermind
            </ButtonStyled>
          </div>
        ) : (
          <div>
            <ButtonStyled onClick={deleteRecurrence}>
              Delete Subscription
            </ButtonStyled>
            <ButtonStyled onClick={() => dispatch(closeModal())} color='secondary'>
              Nevermind
            </ButtonStyled>
          </div>
        )}
      >
      </ModalContent>
    </ModalView>
  )
}

DeleteRecurrence.displayName = 'DeleteRecurrence'
export default DeleteRecurrence