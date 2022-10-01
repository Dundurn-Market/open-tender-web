import { ModalContent, ModalView } from '../Modal'
import { ButtonStyled } from '@open-tender/components'
import { closeModal, toggleSidebar } from '../../slices'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  editOrder,
  removeItemFromCartById, resetCheckout,
  resetOrder,
  selectTimezone,
  setSubmitting, showNotification,
  submitOrder
} from '@open-tender/redux'
import { isoToDateStr } from '@open-tender/js'


const SkipRecurrence = ({ recurrence, order }) => {
  const tz = useSelector(selectTimezone)
  const readableDate = isoToDateStr(order.requested_at, tz, 'EEEE, MMMM dd')
  const dispatch = useDispatch()

  const skipRecurrence = async () => {
    await dispatch(editOrder(order, false))

    dispatch(removeItemFromCartById(recurrence.item))
    dispatch(setSubmitting(true))
    dispatch(submitOrder())

    dispatch(showNotification(`${recurrence.item.name} will be skipped on your upcoming order on ${readableDate}`))
    dispatch(resetOrder())
    dispatch(resetCheckout())
  }

  return (
    <ModalView>
      <ModalContent
        title='Are you sure you want to skip this item in the next order?'
        subtitle={
          <>
            <p>
              {recurrence.item.name} will be removed from the upcoming order on {readableDate}.
            </p>
            <p>
              It will continue to be added to future recurring orders.
            </p>
          </>
        }
        footer={
          <div>
            <ButtonStyled onClick={skipRecurrence}>
              Skip Next Order
            </ButtonStyled>
            <ButtonStyled onClick={() => dispatch(closeModal())} color='secondary'>
              Cancel
            </ButtonStyled>
          </div>
        }

      >
      </ModalContent>
      }
    </ModalView>
  )
}

SkipRecurrence.displayName = 'SkipRecurrence'
export default SkipRecurrence