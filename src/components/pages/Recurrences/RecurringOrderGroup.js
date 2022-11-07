import { useDispatch, useSelector } from 'react-redux'
import { editOrder, selectRevenueCenters, selectTimezone } from '@open-tender/redux'
import {
  capitalize,
  isoToDateStr,
  minutesToDate,
  time24ToMinutes
} from '@open-tender/js'
import { openModal } from '../../../slices'
import { ButtonStyled } from '@open-tender/components'
import { Row } from '../../index'
import { getLongName } from '../../../utils'
import * as PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
import { RecurringItemImage } from './Recurrences'
import Tag from '../../Tag'
import { isoToDate } from '@open-tender/js/lib/datetimes'
import { add, format } from 'date-fns'

const OrderGroupCard = styled.div`
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: #dee5d4;
  border-radius: 0.7rem;
  position: relative;
`

const OrderGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  p {
    margin-bottom: .2rem;
  }
  
  button:not(:last-child) {
    margin: 0 1rem 0.5rem 0;
  }
`

const OrderGroupTitle = styled.h6`
  margin-bottom: .6rem;
`

const OrderGroupTag = styled('div')`
  position: absolute;
  top: -1.1rem;
`

function RecurringOrderGroup({ order, recurrences, revenueCenter }) {
  const dispatch = useDispatch()

  const tz = useSelector(selectTimezone)
  const readableDate = isoToDateStr(order.requested_at, tz, 'EEE, MMM dd')
  const orderDay = isoToDateStr(order.requested_at, tz, 'EEEE')

  //const revenueCenter = revenueCenters.revenueCenters.find(rc => rc.revenue_center_id === order.revenue_center.revenue_center_id)
  if (revenueCenter == null) { // this is a band - aid fix because outpost order break this:
    return null;
  }
  const orderTimes = revenueCenter.order_times[order.service_type]

  const orderWindow = orderTimes.find(ot => ot.weekday === orderDay.toUpperCase())
  const orderByTime = orderWindow ? orderWindow.order_by.time : null;
  const orderDate = isoToDate(order.requested_at, tz)
  const orderByDate = orderByTime ? minutesToDate(time24ToMinutes(orderByTime), orderDate) : null
  const formattedOrderByDate = orderByDate ? format(orderByDate, "EEE, MMM dd 'at' HH:mm a") : null

  const isEditable = (!orderByDate || orderByDate > Date.now()) && order.is_editable
  const isError = !isEditable && orderDate < add(Date.now(), {minutes: 30})

  const singleItems = order.cart.filter(i => !recurrences.find(r => i.id === r.item_id))

  const cancelRecurrence = (recurrence) => () => {
    dispatch(openModal({ type: 'deleteRecurrence', args: { recurrence, order } }))
  }

  const skipRecurrence = (recurrence) => () => {
    dispatch(openModal({ type: 'skipRecurrence', args: { recurrence, order } }))
  }

  const editNextOrder = () => {
    dispatch(editOrder(order))
  }

  const postponeOrder = () => {
    dispatch(openModal({ type: 'postponeOrder', args: { order } }))
  }

  const deleteOrder = () => {
    dispatch(openModal({ type: 'cancelOrder', args: { order } }))
  }

  return (
    <OrderGroupCard>
      <OrderGroupTag>
        { formattedOrderByDate && (
          <Tag text={isEditable
            ?`Edit By ${formattedOrderByDate}`
            : isError
              ? 'There has been an error renewing your order. please contact MRKTBOX to resolve this.'
              : 'No Longer Editable'}
               bgColor={isEditable? 'success': isError? 'error':'primary'}
          />
        )}
      </OrderGroupTag>
      <OrderGroupHeader>
        <div>
          <OrderGroupTitle>{isError? 'Last':'Next'} {capitalize(order.service_type)} Order {isError?'Received':'Scheduled'} on {readableDate}</OrderGroupTitle>
          {order.address ? (
            <>
              <p>{order.address.street}, {order.address.city}</p>
              <p>{order.requested_time}</p>
            </>
          ) : (
            <p>Ready at {order.revenue_center.name} between {order.requested_time}</p>
          )}
        </div>
        <div>
          <ButtonStyled disabled={!isEditable} onClick={editNextOrder} size='small'>
            Edit
          </ButtonStyled>
          <ButtonStyled onClick={postponeOrder} size='small' color='secondary' disabled={!isEditable}>
            Postpone Order
          </ButtonStyled>
          <ButtonStyled onClick={deleteOrder} size='small' disabled={!isEditable} color='cart'>
            Cancel Order
          </ButtonStyled>
        </div>
      </OrderGroupHeader>
      {recurrences.map((recurrence) => (
        <Row
          key={recurrence.id}
          icon={<RecurringItemImage as='span'
                                       style={{ backgroundImage: `url('${recurrence.item.small_image_url}')` }} />}
          content={
            <>
              <p className='title'>{recurrence.item.name}{recurrence.isSkipped && <> - <b>SKIPPED</b></>}</p>
              {recurrence.modifiers && recurrence.modifiers.map(m => (
                <p>{m.name}: {m.opts.join(', ')}</p>
              ))}
              <p>Quantity: {recurrence.quantity}</p>
              <p>Created on: {recurrence.created_at.split('T')[0]}</p>
              <p>Re-occurs: {getLongName(recurrence.frequency)} on {orderDay}s</p>
              {/*  <ButtonLink>see next order</ButtonLink></p>*/}
            </>
          }
          actions={
            <>
              <ButtonStyled
                onClick={skipRecurrence(recurrence)}
                size='small'
                color='secondary'
                disabled={!isEditable}
                style={{ margin: '0 1rem .5rem 0' }}
              >
                {recurrence.isSkipped? 'Un-skip Item':'Skip Item'}
              </ButtonStyled>
              <ButtonStyled
                onClick={cancelRecurrence(recurrence)}
                size='small'
                color='cart'
              >
                Delete Subscription
              </ButtonStyled>
            </>
          }
          style={recurrence.isSkipped ? {opacity: .65} : null}
        />
      ))}
      {singleItems.length > 0 && (
        <div style={{borderBottom: '1px solid', marginBottom: '2rem'}}>
          <h6>Non-Recurring Items</h6>
        </div>
      )}
      {singleItems.length > 0 && (singleItems.map((item, index) => (
          <Row
            key={index}
            icon={<RecurringItemImage as='span'
                                      style={{ backgroundImage: `url('${item.images.find(i => i.type === 'APP_IMAGE').url}')` }} />}
            content={
              <>
                <p className='title'>{item.name}</p>
                <p>Quantity: {item.quantity}</p>
              </>
            }
            style={{opacity: .65}}
          />
        ))
      )}
    </OrderGroupCard>
  )
}

RecurringOrderGroup.propTypes = {
  recurrences: PropTypes.array,
  orderId: PropTypes.number
}

export default RecurringOrderGroup