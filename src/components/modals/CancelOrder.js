import { ModalContent, ModalView } from '../Modal'
import { ButtonStyled, SelectOnly } from '@open-tender/components'
import { closeModal, toggleSidebar } from '../../slices'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteCustomerOrder,
  editOrder,
  removeItemFromCartById, resetCheckout,
  resetOrder,
  selectTimezone, setRequestedAt,
  setSubmitting, showNotification,
  submitOrder
} from '@open-tender/redux'
import { dateToIso, isoToDateStr } from '@open-tender/js'
import { format, parseISO } from 'date-fns'
import { isoToDate } from '@open-tender/js/lib/datetimes'

const CancelOrder = ({ order }) => {
  const tz = useSelector(selectTimezone)
  const readableDate = isoToDateStr(order.requested_at, tz, 'EEEE, MMMM dd')
  const dispatch = useDispatch()

  const cancelOrder = async () => {
    await dispatch(deleteCustomerOrder(order.order_id))
    dispatch(closeModal())
  }

  return (
    <ModalView>
      <ModalContent
        title='Are you sure you want to cancel this order?'
        subtitle={
          <>
            <p>
              Order scheduled for {readableDate} will be removed.
            </p>
          </>
        }
        footer={
        <>
          <div>
            <ButtonStyled onClick={cancelOrder}>
              Yes, Cancel Order
            </ButtonStyled>
            <ButtonStyled onClick={() => dispatch(closeModal())} color='secondary'>
              Nevermind
            </ButtonStyled>
          </div>
        </>
        }

      >
      </ModalContent>
      }
    </ModalView>
  )
}

CancelOrder.displayName = 'CancelOrder'
export default CancelOrder