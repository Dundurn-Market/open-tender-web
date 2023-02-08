import React, { useState } from 'react'
import propTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'
import {
  setOrderServiceType,
  setRevenueCenter, setRequestedAt
} from '@open-tender/redux'
import {  ButtonStyled } from '@open-tender/components'
import { openModal } from '../../slices'
import { capitalize } from '@open-tender/js'
import ReactTooltip from 'react-tooltip'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'

export const OrderTypeButtonContainer = styled('div')`
  display: inline-block;
`

export const RevenueCenterOrderTypeButtons = ({ revenueCenters,
                                                orderType,
                                                setShowLocations,
                                                setDisplayedRevenueCenters,
                                                serviceType }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const [displayingAsap, setDisplayingAsap] = useState(false)
  const [displayingScheduled, setDisplayingScheduled] = useState(false)

  const scheduledRevenueCenters = []
  const asapRevenueCenters = []

  for (const revenueCenter of revenueCenters) {
    if (revenueCenter.delivery_zone.priority === 1) {
      scheduledRevenueCenters.push(revenueCenter)
    } else {
      asapRevenueCenters.push(revenueCenter)
    }
  }

  const hasAsapDelivery = asapRevenueCenters.length > 0 &&
    asapRevenueCenters[0].first_times &&
    asapRevenueCenters[0].first_times[serviceType.toUpperCase()]
  const hasScheduledDelivery = scheduledRevenueCenters.length > 0 &&
    scheduledRevenueCenters[0].order_times &&
    scheduledRevenueCenters[0].order_times[serviceType.toUpperCase()]

  // const handleDelivery = () => {
  //   dispatch(setOrderServiceType(rcType, 'DELIVERY', isOutpost))
  //   if (isOutpost) {
  //     dispatch(setAddress(address))
  //     dispatch(setRevenueCenter(revenueCenter))
  //     navigate(menuSlug)
  //   } else {
  //     dispatch(setAddress(null))
  //     dispatch(setRevenueCenter(revenueCenter))
  //     dispatch(openModal({ type: 'mapsAutocomplete' }))
  //   }
  // }

  const scheduleOrder = (revenueCenter) => {
    const args = {
      focusFirst: true,
      skipClose: true,
      //TODO not sure if we should support scheduled group orders.. for now, NO
      isGroupOrder: false,
      //isGroupOrder: isGroupOrder || cartId ? true : false,
      style: (revenueCenter && revenueCenter.order_times)
        ? { alignItems: 'flex-start' }
        : {},
      revenueCenter: revenueCenter,
      serviceType: serviceType,
      orderType,
    }
    dispatch(openModal({ type: 'requestedAt', args }))
  }

  const orderAsap = () => {
    if (!hasAsapDelivery) return
    if (serviceType === 'DELIVERY' && asapRevenueCenters.length === 1) {
      scheduleOrder(asapRevenueCenters[0])
      setShowLocations(false)
    } else {
      setShowLocations(true)
      setDisplayingAsap(true)
      setDisplayedRevenueCenters(asapRevenueCenters)
    }
    setDisplayingScheduled(false)
  }

  const orderLater = () => {
    if (serviceType === 'DELIVERY') {
      scheduleOrder(scheduledRevenueCenters[0])
      setShowLocations(false)
    } else {
      setShowLocations(true)
      setDisplayingScheduled(true)
      setDisplayedRevenueCenters(scheduledRevenueCenters)
    }
    setDisplayingAsap(false)
  }

  return (
    <>
      <OrderTypeButtonContainer data-tip data-for="scheduleButton" style={{"margin": '0 1.5rem 2rem 0'}}>
        <ButtonStyled
          label={`Schedule a delivery`}
          onClick={orderLater}
          size={isMobileOnly ? 'small' : 'default'}
          disabled={!hasScheduledDelivery || displayingScheduled}
          >
          Schedule Grocery {capitalize(serviceType)}
        </ButtonStyled>
        <ReactTooltip id="scheduleButton" place='bottom' effect='solid' backgroundColor={theme.bgColors.dark} disable={isMobileOnly}>
          { hasScheduledDelivery
            ? `Shop our entire grocery offering & setup subscriptions to your favorite local products.`
            : `Scheduled ${capitalize(serviceType)} is not available at your location.`
          }
        </ReactTooltip>
      </OrderTypeButtonContainer>
      <OrderTypeButtonContainer data-tip data-for="asapButton" style={{"margin": '0 0 2rem 0'}}>
        <ButtonStyled
          label={`Order Quick Delivery`}
          onClick={orderAsap}
          size={isMobileOnly ? 'small' : 'default'}
          disabled={!hasAsapDelivery || displayingAsap}
        >
          Order Quick Cafe {capitalize(serviceType)}
        </ButtonStyled>
        <ReactTooltip id="asapButton" place='bottom' effect='solid' backgroundColor={theme.bgColors.dark} disable={isMobileOnly}>
          { hasAsapDelivery
            ? `Place a quick cafe or grocery staples order. Pickup orders ready in as little as 20 minutes and delivery in 1hr.`
            : `Quick ${capitalize(serviceType)} is not available at your location.`
          }
        </ReactTooltip>
      </OrderTypeButtonContainer>
    </>
  )
}

RevenueCenterOrderTypeButtons.displayName = 'RevenueCenterOrderTypeButtons'
RevenueCenterOrderTypeButtons.propTypes = {
  revenueCenter: propTypes.array,
  orderType: propTypes.string,
  isGroupOrder: propTypes.bool,
  setShowLocations: propTypes.func
}

export default RevenueCenterOrderTypeButtons
