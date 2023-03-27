import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import * as PropTypes from 'prop-types'

import {
  editOrder,
  fetchLocations,
  selectTimezone,
  selectRevenueCenters,
} from '@open-tender/redux'
import { BgImage, ButtonStyled } from '@open-tender/components'
import {
  capitalize,
  isDateOld,
  isoToDate,
  isoToDateStr,
  minutesToDate,
  time24ToMinutes
} from '@open-tender/js'

import Row from '../../CompactRow'
import Tag from '../../Tag'

import { openModal } from '../../../slices'
import { getLongName } from '../../../utils'
import { isScheduled, isValidTime } from '../../../utils/revenueCenters'

import { parseDate } from '../../../utils/date'

const OrderGroupCard = styled.div`
  border-radius: 0.7rem;
  padding: 2rem;
  margin-bottom: 3rem;
  background-color: #dee5d4;
  position: relative;
`

const OrderGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 1.2rem;

  p {
    margin-bottom: .2rem;
  }

  button:not(:last-child) {
    margin: 0 1rem 0.5rem 0;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`

const OrderGroupTitle = styled.h6`
  margin-bottom: .6rem;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`

const OrderGroupTag = styled('div')`
  position: absolute;
  top: -1.1rem;

  span {
    margin-top: 0rem;
  }
`

const ImageView = styled(BgImage)`
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${(props) => props.theme.border.radiusSmall};
  background-color: ${(props) => props.theme.bgColors.tertiary};
  display: flex;
`

const OrderItem = ({ subscription, order, disabled }) => {
  const dispatch = useDispatch()
  const tz = useSelector(selectTimezone)

  const orderDay = subscription.renewed_at
    ? isoToDateStr(subscription.renewed_at, tz, 'EEEE')
    : null

  const cancelRecurrence = () => {
    dispatch(
      openModal({
        type: 'deleteRecurrence',
        args: { subscription, order }
      })
    )
  }

  const skipRecurrence = () => {
    dispatch(
      openModal({
        type: 'skipRecurrence',
        args: {
          item : subscription.item,
          order,
        }
      })
    )
  }

  const restoreRecurrence = () => {
    dispatch(
      openModal({
        type: 'restoreRecurrence',
        args: {
          recurrence : subscription.recurrence,
          menuItem : subscription.menuItem,
          order,
        }
      })
    )
  }

  return (
    <Row
      icon={(
        <ImageView
          as='span'
          style={{
            ...(!subscription.item && {opacity : 0.5 }),
            backgroundImage : `url('${subscription.img}')`
          }}
        />
      )}
      content={(
        <>
          <p className='title'>
            { subscription.exists
              ? subscription.name
              : <s>{subscription.name}</s>
            }
          </p>
          { !!subscription.groups &&
            (!!subscription.item || !!subscription.menuItem) &&
            (!!subscription.item
              ? subscription.item.groups.map((m) => {
                const options = m.options.map((i) => i.name).join(', ')
                return <p>{ m.name }: { options }</p>
              })
              : subscription.menuItem.option_groups.map((m) => {
                const group = subscription.groups.find((n) => n.id === m.id)
                if (!group) return null

                const options = m.option_items.filter(
                  (i) => group ?.options.find((j) => j.id === i.id)
                ).map((i) => i.name).join(', ')
                return <p>{ m.name }: { options }</p>
              })
            )
          }
          <p>Quantity: {subscription.quantity}</p>
          { !!subscription.recurrence
            ? <>
              <p>
                Created on: {subscription.recurrence.created_at.split('T')[0]}
              </p>
              <p>
                Re-occurs: {getLongName(subscription.frequency)} on {orderDay}s
              </p>
            </>
            : <p>Non-recurring</p>
          }
        </>
      )}
      actions={ !!subscription.recurrence
        ? <>
          <ButtonStyled
            onClick={subscription.exists
              ? skipRecurrence
              : restoreRecurrence
            }
            size='small'
            color='secondary'
            disabled={disabled}
            style={{ margin: '0 1rem .5rem 0' }}
          >
            { subscription.exists ? 'Skip Item' : 'Restore Item' }
          </ButtonStyled>
          <ButtonStyled
            onClick={cancelRecurrence}
            size='small'
            color='cart'
            disabled={disabled}
          >
            Delete Subscription
          </ButtonStyled>
        </>
        : null
      }
      style={ disabled || !subscription.recurrence
        ? {
          opacity : 0.65,
          backgroundColor: 'rgba(255, 255, 255, .3)',
        }
        : null
      }
    />
  )
}

const SubscriptionOrderGroup = ({ subscriptionGroup }) => {
  const dispatch = useDispatch()
  const tz = useSelector(selectTimezone)

  const {
    revenueCenters,
    last_updated: revenueCentersLastUpdated,
  } = useSelector(selectRevenueCenters)

  useEffect(() => {
    if (
      !revenueCenters.length ||
      !revenueCentersLastUpdated ||
      isDateOld(revenueCentersLastUpdated)
    ) {
      dispatch(fetchLocations({type: 'OLO'}))
    }
  }, [])

  const revenueCenter = revenueCenters.find(
    rc => rc.revenue_center_id === subscriptionGroup.revenue_center_id,
  )

  if (
    revenueCenter == null ||
    !isScheduled(revenueCenter)
  ) {
    return null;
  }

  const isDelivery = subscriptionGroup.service_type === 'DELIVERY'

  const readableDate = isoToDateStr(
    subscriptionGroup.requested_at,
    tz,
    'EEE, MMM dd',
  )
  const orderDay = isoToDateStr(subscriptionGroup.requested_at, tz, 'EEEE')

  const orderDate = isoToDate(subscriptionGroup.requested_at, tz)
  const orderTimes = revenueCenter.order_times[subscriptionGroup.service_type]
  const orderWindow = orderTimes.find(
    ot => ot.weekday === orderDay.toUpperCase()
  )

  const orderByTime = (orderWindow ? orderWindow : orderTimes[0])?.order_by?.time
  const orderByDate = orderByTime
    ? minutesToDate(time24ToMinutes(orderByTime), orderDate)
    : null

  const isEditable = (!orderByDate || orderByDate > Date.now()) &&
    (!subscriptionGroup.order || subscriptionGroup.order.is_editable)
  const shouldEdit = (
      revenueCenter &&
      subscriptionGroup.requested_at &&
      subscriptionGroup.service_type
    ) ? isValidTime(
      revenueCenter,
      subscriptionGroup.requested_at,
      subscriptionGroup.service_type,
    ) : false

  const orderByText = orderByDate
    ? orderByDate.toLocaleDateString(
      "en-US",
      { weekday: 'short', month: 'short', day: 'numeric' }
    ) + ' at ' + orderByDate.toLocaleTimeString(
      "en-US",
      { hour: '2-digit', minute: '2-digit' }
    )
    : null
  const tagText = !subscriptionGroup.order
    ? 'Skipped'
    : (orderByText
        ?  `Edit By ${orderByText}`
        : 'No Longer Editable')

  const locationText = isDelivery
    ? `${subscriptionGroup.address.street}, ${subscriptionGroup.address.city}`
    : revenueCenter.name
  const timeText = subscriptionGroup.order?.requested_time
    ? subscriptionGroup.order?.requested_time
      .replace('-', '\xa0-\xa0').replace(/pm/g, '\xa0pm')
      .replace(/am/g, '\xa0am')
    : (parseDate(subscriptionGroup.requested_at)).toLocaleTimeString(
        "en-US",
        { hour : 'numeric', minute : 'numeric', hour12 : true },
    ).toLowerCase().replace(/ pm/g, '\xa0pm').replace(/ am/g, '\xa0am')

  const groupTitle = `${capitalize(subscriptionGroup.service_type)} Order\n` +
    `Sheduled for ${readableDate}`

  const groupSubTitle = subscriptionGroup.order?.requested_time
    ? `${isDelivery ? 'Delivered to' : 'Ready at'} ` +
      `${locationText} between ${timeText}`
    : `${isDelivery ? 'Delivered to' : 'Ready at'} ` +
      `${locationText} at approx. ${timeText}`

  const editNextOrder = () => {
    dispatch(editOrder(subscriptionGroup.order))
  }

  const postponeOrder = () => {
    dispatch(
      openModal({
        type: 'postponeOrder',
        args: {
          order : subscriptionGroup.order,
          subscriptions : subscriptionGroup.subscriptions,
        },
      })
    )
  }

  const deleteOrder = () => {
    dispatch(
      openModal({
        type: 'cancelOrder',
        args: { order : subscriptionGroup.order },
      }
    ))
  }

  return (
    <OrderGroupCard>
      <OrderGroupTag>
        { !!tagText && (
          <Tag
            text={tagText}
            bgColor={isEditable && !!subscriptionGroup.order
              ? 'success'
              : 'tertiary'
            }
          />
        )}
      </OrderGroupTag>
      <OrderGroupHeader>
        <div>
          <OrderGroupTitle>{ groupTitle }</OrderGroupTitle>
          { groupSubTitle
            ? (!!subscriptionGroup.order
              ? groupSubTitle
              : <s>{ groupSubTitle }</s>)
            : null
          }
        </div>
        { !!subscriptionGroup.order &&
          <div style={{ flexShrink : 0 }}>
            <ButtonStyled
              disabled={!isEditable || !shouldEdit}
              onClick={editNextOrder}
              size='small'
            >
              Edit
            </ButtonStyled>
            <ButtonStyled
              onClick={postponeOrder}
              size='small'
              color='secondary'
              disabled={!isEditable}
            >
              Postpone Order
            </ButtonStyled>
            <ButtonStyled
              onClick={deleteOrder}
              size='small'
              disabled={!isEditable}
              color='cart'
            >
              Cancel Order
            </ButtonStyled>
          </div>
        }
      </OrderGroupHeader>
      {subscriptionGroup.subscriptions.map((sub) => (
        <OrderItem
          key={sub.recurrence
            ? sub.recurrence.id
            : `${subscriptionGroup.order.id}-${sub.item.id}`
          }
          subscription={sub}
          order={subscriptionGroup.order}
          disabled={!isEditable}
        />
      ))}
    </OrderGroupCard>
  )
}

SubscriptionOrderGroup.propTypes = {
  recurrences: PropTypes.array,
  orderId: PropTypes.number
}

export default SubscriptionOrderGroup
