import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  addItemToCart,
  editOrder,
  fetchCustomerOrders,
  resetCheckout,
  resetOrder,
  selectCustomer,
  selectCustomerCreditCards,
  selectTimezone,
  selectRevenueCenters,
  setAddress,
  setOrderServiceType,
  setSubmitting,
  setRequestedAt,
  setRevenueCenter,
  showNotification,
  submitOrder,
  updateForm,
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'
import { makeOrderItem } from '@open-tender/js'
import { isoToDateStr } from '@open-tender/js'

import { ModalContent, ModalView } from '../Modal'
import { closeModal } from '../../slices'
import { parseDate } from '../../utils/date'

const RestoreRecurrence = ({ recurrence, menuItem, order }) => {
  const dispatch = useDispatch()
  const tz = useSelector(selectTimezone)
  const { revenueCenters } = useSelector(selectRevenueCenters)
  const { profile : customer } = useSelector(selectCustomer)
  const { entities : creditCards } = useSelector(selectCustomerCreditCards)

  const defaultCard = creditCards.find((i) => i.is_default) || creditCards[0]

  const readableDate = isoToDateStr(
    order ? order.requested_at : recurrence.renewed_at,
    tz,
    'EEEE, MMMM dd',
  )
  const revenueCenter = revenueCenters.find(
    rc => rc.revenue_center_id === recurrence.revenue_center_id,
  )

  const restoreRecurrence = async () => {
    if (order) {
      await dispatch(editOrder(order, false))
    } else {
      await dispatch(resetOrder())
      await dispatch(resetCheckout())

      await dispatch(
        setOrderServiceType(
          revenueCenter.revenue_center_type,
          recurrence.service_type,
          revenueCenter.is_outpost,
          )
        )
      await dispatch(setRevenueCenter(revenueCenter))
      await dispatch(setRequestedAt(
        parseDate(recurrence.renewed_at).toISOString().split('.')[0] + 'Z',
      ))
      if (recurrence.address) await dispatch(setAddress(recurrence.address))

      await dispatch(
        updateForm({
          customer : {
            customer_id : customer.customer_id,
            first_name : customer.first_name,
            last_name : customer.last_name,
            email : customer.email,
            phone : customer.phone,
            company : customer.company,
          },
          tenders: [{
            tender_type: 'CREDIT',
            ...defaultCard,
          }]
          }
        )
      )
    }

    await dispatch(
      addItemToCart(
        {
          ...(makeOrderItem(menuItem)),
          groups: recurrence.groups ? recurrence.groups : [],
          quantity: recurrence.quantity,
          frequency: recurrence.frequency,
          recurrence_id: recurrence.id,
        }
      )
    )

    await dispatch(setSubmitting(true))
    await dispatch(submitOrder())

    dispatch(
      showNotification(
          `${menuItem.name} was added to your upcoming order on ${readableDate}`
        )
      )
    dispatch(resetOrder())
    dispatch(resetCheckout())
    dispatch(fetchCustomerOrders())
  }

  return (
    <ModalView>
      <ModalContent
        title={'Are you sure you want to restore this item?'}
        subtitle={
          <>
            <p>
              { menuItem.name } will be
              { !!order ? ' added to the upcoming order on ' : ' ordered for ' }
              { readableDate }.
            </p>
          </>
        }
        footer={
          <div>
            <ButtonStyled onClick={restoreRecurrence}>
              Restore This Item
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

RestoreRecurrence.displayName = 'SkipRecurrence'
export default RestoreRecurrence
