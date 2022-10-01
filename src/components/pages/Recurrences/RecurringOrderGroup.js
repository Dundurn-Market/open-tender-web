import { useDispatch, useSelector } from 'react-redux'
import { deleteCustomerOrder, editOrder, selectTimezone } from '@open-tender/redux'
import { capitalize, isoToDateStr } from '@open-tender/js'
import { openModal } from '../../../slices'
import { ButtonStyled, BgImage } from '@open-tender/components'
import { Row } from '../../index'
import { getLongName } from '../../../utils'
import * as PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
import { RecurringItemImage } from './Recurrences'

const OrderGroupCard = styled.div`
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: #dee5d4;
  border-radius: 0.7rem;
`

const OrderGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  p {
    margin-bottom: .2rem;
  }
`

const OrderGroupTitle = styled.h6`
  text-decoration: underline;
  margin-bottom: .6rem;
`

function RecurringOrderGroup({ order, recurrences }) {
  const dispatch = useDispatch()

  const tz = useSelector(selectTimezone)
  const readableDate = isoToDateStr(order.requested_at, tz, 'EEE, MMM dd')
  const orderDay = isoToDateStr(order.requested_at, tz, 'EEEE')

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
      <OrderGroupHeader>
        <div>
          <OrderGroupTitle>Next {capitalize(order.service_type)} Order Scheduled on {readableDate}</OrderGroupTitle>
          {order.address ? (
            <>
              <p>{order.address.street}, {order.address.city}</p>
              <p>{order.requested_time}</p>
            </>
          ) : (
            <p>Ready at {order.requested_time}</p>
          )}
          {!order.is_editable && (
            <p><b> - No Longer Editable - </b></p>
          )}

        </div>
        <div>
          <ButtonStyled disabled={!order.is_editable} onClick={editNextOrder} style={{ marginRight: '1rem' }} size='small'>
            Edit
          </ButtonStyled>
          <ButtonStyled onClick={postponeOrder} size='small' color='secondary'
                        style={{ marginRight: '1rem' }} disabled={!order.is_editable}
          >
            Postpone Order
          </ButtonStyled>
          <ButtonStyled onClick={deleteOrder} size='small' disabled={!order.is_editable}
                        style={{ backgroundColor: '#e24a4a', borderColor: '#e24a4a' }}
          >
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
                disabled={recurrence.isSkipped || !order.is_editable}
                style={{ marginRight: '1rem' }}
              >
                Skip Item
              </ButtonStyled>
              <ButtonStyled
                onClick={cancelRecurrence(recurrence)}
                size='small'
                style={{ backgroundColor: '#e24a4a', borderColor: '#e24a4a' }}
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
          <h7>Non-Recurring Items</h7>
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