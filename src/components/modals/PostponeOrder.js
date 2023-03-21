import React, {  useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'

import {
  editOrder,
  fetchCustomerOrders,
  fetchCustomerRecurrences,
  resetCheckout,
  resetOrder,
  selectTimezone,
  setRequestedAt,
  setSubmitting,
  submitOrder,
  updateRecurrence,
} from '@open-tender/redux'
import { ButtonStyled, SelectOnly } from '@open-tender/components'
import { adjustIso, dateToIso, isoToDateStr } from '@open-tender/js'

import { closeModal } from '../../slices'
import { ModalContent, ModalView } from '../Modal'
import { parseDate } from '../../utils/date'

const postponeOptions = [
  {name: '1 Week', value: '1'},
  {name: '2 Weeks',  value: '2'},
  {name: '3 Weeks', value: '3'},
  {name: '4 Weeks', value: '4'},
]

const PostponeBody = styled.div`
  > span {
    width: 50%;
    margin: .5rem 0;
  }

  select:focus {
    outline: none;
  }

`

const PostponeOrder = ({ order, subscriptions }) => {
  const dispatch = useDispatch()
  const tz = useSelector(selectTimezone)

  const [weeks, setWeeks] = useState(1)

  useEffect(() => {
    if (!order) dispatch(closeModal())
  }, [order])

  if (!order) return null

  const maxDate = new Date().setDate(new Date().getDate() + 31)
  let availableOptions = []
  for (const opt of postponeOptions) {
    const optionDate = parseDate(
      adjustIso(
        order.requested_at,
        tz,
        {weeks : parseInt(opt.value)},
      )
    ).getTime()
    if (optionDate > maxDate)
      break
    availableOptions.push(opt)
  }

  const date = adjustIso(order.requested_at, tz, {weeks})

  const postponeOrder = async () => {
    const newDate = dateToIso(date, tz)
    await dispatch(editOrder(order, false))
    await dispatch(setRequestedAt(newDate))

    await dispatch(setSubmitting(true))
    await dispatch(submitOrder())

    // TODO: check order status, assign new order_id
    subscriptions.forEach(i => {
      if (!i.recurrence) return
      dispatch(
        updateRecurrence({
          ...i.recurrence,
          order_id : null,
          requested_at : newDate,
        })
      )
    })

    dispatch(resetOrder())
    dispatch(resetCheckout())

    dispatch(fetchCustomerOrders())
    dispatch(fetchCustomerRecurrences())
  }

  const setPostponeWeeks = (event) => {
    const weekInt = parseInt(event.target.value)
    setWeeks(weekInt)
  }

  return (
    <ModalView>
      <ModalContent
        title='Postpone Order'
        subtitle={ availableOptions.length !== 0 ? (
          <PostponeBody>
            <p>
              How many weeks would you like to postpone?
            </p>
            <SelectOnly
              value={weeks}
              onChange={setPostponeWeeks}
              options={availableOptions}
            />
            <p>
              The order will be rescheduled for
              {isoToDateStr(date, tz, 'EEEE, MMMM dd')}
            </p>
          </PostponeBody>
          ) : (
          <p>
            You cannot postpone an order more then 4 weeks in the future.
            Instead, you can cancel the order and re-add it when ready
          </p>
        )}
        footer={
        <>
          <div>
            {availableOptions.length !== 0 &&
              <ButtonStyled onClick={postponeOrder}>
                Postpone
              </ButtonStyled>
            }
            <ButtonStyled
              onClick={() => dispatch(closeModal())}
              color='secondary'
            >
              Cancel
            </ButtonStyled>
          </div>
        </>
        }
      >
      </ModalContent>
    </ModalView>
  )
}

PostponeOrder.displayName = 'PostponeOrder'
export default PostponeOrder
