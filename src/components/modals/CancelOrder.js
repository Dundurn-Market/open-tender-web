import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  deleteCustomerOrder,
  selectTimezone
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'
import { capitalize, isoToDateStr } from '@open-tender/js'

import { closeModal } from '../../slices'
import { ModalContent, ModalView } from '../Modal'

const CancelOrder = ({ order }) => {
  const tz = useSelector(selectTimezone)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!order) dispatch(closeModal())
  }, [order])

  if (!order) return null

  const readableDate = isoToDateStr(order.requested_at, tz, 'EEEE, MMMM dd')

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
              The {capitalize(order.service_type)} order scheduled for
              {readableDate} will be cancelled. However any subscriptions
              related to that order will not be removed.
            </p>
          </>
        }
        footer={
        <>
          <div>
            <ButtonStyled onClick={cancelOrder}>
              Yes, Cancel Order
            </ButtonStyled>
            <ButtonStyled
              onClick={() => dispatch(closeModal())}
              color='secondary'
            >
              Nevermind
            </ButtonStyled>
          </div>
        </>
        }
      >
      </ModalContent>
    </ModalView>
  )
}

CancelOrder.displayName = 'CancelOrder'
export default CancelOrder