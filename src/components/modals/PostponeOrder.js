import { ModalContent, ModalView } from '../Modal'
import { ButtonStyled, SelectOnly } from '@open-tender/components'
import { closeModal } from '../../slices'
import React, {  useState } from 'react'
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
import { adjustIso, dateToIso, isoToDateStr } from '@open-tender/js'
import { isoToDate } from '@open-tender/js/lib/datetimes'
import styled from '@emotion/styled'


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

  const postponeOptions = [
    {name: '1 Week', value: '1'},
    {name: '2 Weeks',  value: '2'},
    {name: '3 Weeks', value: '3'},
    {name: '4 Weeks', value: '4'},
  ]

  const maxDate = new Date().setDate(new Date().getDate() + 31)

  let availableOptions = []
  for (const opt of postponeOptions) {
    const optionDate =  new Date(isoToDate(order.requested_at, tz).getTime() + parseInt(opt.value) * 6.048e+8)
    if (optionDate > maxDate)
      break
    availableOptions.push(opt)
  }

  const [weeks, setWeeks] = useState(1)
  const date = adjustIso(order.requested_at, tz, {weeks})

  const postponeOrder = async () => {
    await dispatch(editOrder(order, false))
    const s = dateToIso(date, tz)
    dispatch(setRequestedAt(s))
    dispatch(setSubmitting(true))
    await dispatch(submitOrder())

    dispatch(resetOrder())
    dispatch(resetCheckout())
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
            <SelectOnly value={weeks} onChange={setPostponeWeeks} options={availableOptions} />
            <p>
              The order will be rescheduled for {isoToDateStr(date, tz, 'EEEE, MMMM dd')}
            </p>
          </PostponeBody>
          ) : (
          <p>
            You cannot postpone an order more then 4 weeks in the future. Instead, you can cancel the order and re-add it when ready
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
            <ButtonStyled onClick={() => dispatch(closeModal())} color='secondary'>
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