import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  deleteCustomerOrder,
  editOrder,
  fetchCustomerOrders,
  removeItemFromCartById,
  removeRecurrence,
  resetCheckout,
  resetOrder,
  selectTimezone,
  setSubmitting,
  submitOrder
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'
import { isoToDateStr } from '@open-tender/js'

import { closeModal } from '../../slices'
import { ModalContent, ModalView } from '../Modal'

const DeleteRecurrence = ({ subscription, order }) => {
  const dispatch = useDispatch()
  const tz = useSelector(selectTimezone)

  useEffect(() => {
    if (!subscription) dispatch(closeModal())
  }, [subscription])

  if (!subscription) return null

  const item = subscription.item
  const recurrence = subscription.recurrence
  const isDeletable = (order && order.is_editable && !!item)

  const readableDate = isoToDateStr(order? order.requested_at : recurrence.renewed_at, tz, 'EEEE, MMMM dd')

  const deleteOrderAndRecurrence = async () => {
    await dispatch(editOrder(order, false))

    const cart = dispatch(removeItemFromCartById(subscription.item))

    if (cart.length !== 0) {
      dispatch(setSubmitting(true))
      await dispatch(submitOrder())
    } else {
      await dispatch(deleteCustomerOrder(order.order_id))
    }

    //TODO check if this was successful first, before deleting recurrence
    await deleteRecurrence(recurrence)

    dispatch(resetOrder())
    dispatch(resetCheckout())

    dispatch(fetchCustomerOrders())
  }

  const deleteRecurrence = async () => {
    await dispatch(removeRecurrence(recurrence.id, null))
    dispatch(closeModal())
  }

  return (
    <ModalView>
      <ModalContent
        title="Delete Subscription?"
        subtitle={ isDeletable
          ? <p>
            Would you also like to remove {item?.name} from your upcoming order
            scheduled for {readableDate}
          </p>
          : (!item
            ? <>
              <p>
                {subscription.menuItem.name} has already been skipped for this
                order.
              </p>
              <p>
                Delete your subscription to {subscription.menuItem.name} to
                remove the item from all future orders
              </p>
            </>
            : (!!order
              ? <>
                <p>
                  Your upcoming order on {readableDate} containing {item.name}
                  is no longer editable.</p>
                <p>
                  Delete your subscription to remove the item from all future
                  orders
                </p>
              </>
            : <p>
              This subscription is not connected to an upcoming order.
            </p>))
        }
        footer={isDeletable ? (
          <div>
            <ButtonStyled onClick={deleteOrderAndRecurrence}>
              Delete and remove from upcoming order
            </ButtonStyled>
            <ButtonStyled onClick={deleteRecurrence} color='secondary'>
              Delete and keep item in upcoming order
            </ButtonStyled>
            <ButtonStyled
              onClick={() => dispatch(closeModal())}
              color='secondary'
            >
              Nevermind
            </ButtonStyled>
          </div>
        ) : (
          <div>
            <ButtonStyled onClick={deleteRecurrence}>
              Delete Subscription
            </ButtonStyled>
            <ButtonStyled
              onClick={() => dispatch(closeModal())}
              color='secondary'
            >
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
