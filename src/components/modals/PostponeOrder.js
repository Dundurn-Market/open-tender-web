import { ModalContent, ModalView } from '../Modal'
import { ButtonStyled, SelectOnly } from '@open-tender/components'
import { closeModal, toggleSidebar } from '../../slices'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  editOrder,
  resetCheckout,
  resetOrder,
  selectTimezone,
  setRequestedAt,
  setSubmitting,
  submitOrder
} from '@open-tender/redux'
import { dateToIso, isoToDateStr } from '@open-tender/js'
import { format, parseISO } from 'date-fns'
import { isoToDate } from '@open-tender/js/lib/datetimes'
import styled from '@emotion/styled'

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

const PostponeOrder = ({ order }) => {
  const tz = useSelector(selectTimezone)
  const readableDate = isoToDateStr(order.requested_at, tz, 'EEEE, MMMM dd')
  const dispatch = useDispatch()

  const [weeks, setWeeks] = useState('1')
  const date = new Date(isoToDate(order.requested_at, tz).getTime() + parseInt(weeks) * 6.048e+8)

  const postponeOrder = async () => {
    await dispatch(editOrder(order, false))
    const s = dateToIso(date, tz)
    dispatch(setRequestedAt(s))
    dispatch(setSubmitting(true))
    await dispatch(submitOrder())

    // dispatch(showNotification(`${recurrence.item.name} will be skipped on your upcoming order on ${readableDate}`))
    dispatch(resetOrder())
    dispatch(resetCheckout())
  }

  return (
    <ModalView>
      <ModalContent
        title='Postpone Order'
        subtitle={
          <PostponeBody>
            <p>
              How many weeks would you like to postpone?
            </p>
            <SelectOnly value={weeks} onChange={(event) => setWeeks(event.target.value)} options={postponeOptions} />
            <p>
              The order will be rescheduled for {format(date, 'EEEE, MMMM dd')}
            </p>
          </PostponeBody>
        }
        footer={
        <>
          <div>
            <ButtonStyled onClick={postponeOrder}>
              Postpone
            </ButtonStyled>
            <ButtonStyled onClick={() => dispatch(closeModal())} color='secondary'>
              Cancel
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

PostponeOrder.displayName = 'PostponeOrder'
export default PostponeOrder