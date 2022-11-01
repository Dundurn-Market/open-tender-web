import propTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'
import {
  setOrderServiceType,
  setAddress,
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

  const scheduledRevenueCenters = []
  const asapRevenueCenters = []

  for (const revenueCenter of revenueCenters) {
    if (revenueCenter.delivery_zone.priority === 1) {
      scheduledRevenueCenters.push(revenueCenter)
    } else {
      asapRevenueCenters.push(revenueCenter)
    }
  }

  const hasAsapDelivery = asapRevenueCenters.length > 0

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

  const orderAsap = () => {
    if (!hasAsapDelivery) return
    if (serviceType === 'DELIVERY' && asapRevenueCenters.length === 1) {
      dispatch(setRequestedAt('asap'))
      dispatch(setRevenueCenter(asapRevenueCenters[0]))
      dispatch(setOrderServiceType(asapRevenueCenters[0].revenue_center_type, serviceType))
      navigate(`/menu/${asapRevenueCenters[0].slug}`)
    } else {
      setShowLocations(true)
      setDisplayedRevenueCenters(asapRevenueCenters)
    }
  }

  const orderLater = () => {
    if (serviceType === 'DELIVERY') {
      const args = {
        focusFirst: true,
        skipClose: true,
        //TODO not sure if we should support scheduled group orders.. for now, NO
        isGroupOrder: false,
        //isGroupOrder: isGroupOrder || cartId ? true : false,
        style: scheduledRevenueCenters[0].orderTimes ? { alignItems: 'flex-start' } : {},
        revenueCenter: scheduledRevenueCenters[0],
        serviceType: serviceType,
        orderType,
      }
      setShowLocations(false)
      dispatch(openModal({ type: 'requestedAt', args }))
    } else {
      setShowLocations(true)
      setDisplayedRevenueCenters(scheduledRevenueCenters)
    }

  }

  return (
    <>
      <OrderTypeButtonContainer data-tip data-for="scheduleButton" style={{"margin": '0 1.5rem 2rem 0'}}>
        <ButtonStyled
          label={`Schedule a delivery`}
          onClick={orderLater}
          size={isMobileOnly ? 'small' : 'default'}

        >
          Schedule Grocery {capitalize(serviceType)}
        </ButtonStyled>
        <ReactTooltip id="scheduleButton" place='bottom' effect='solid' backgroundColor={theme.bgColors.dark}>
          Shop our entire grocery offering & setup subscriptions to your favorite local products.
        </ReactTooltip>
      </OrderTypeButtonContainer>
      {hasAsapDelivery && (
        <OrderTypeButtonContainer data-tip data-for="asapButton" style={{"margin": '0 0 2rem 0'}}>
          <ButtonStyled
            label={`Order Quick Delivery`}
            onClick={orderAsap}
            size={isMobileOnly ? 'small' : 'default'}

          >
            Order Quick Cafe {capitalize(serviceType)}
          </ButtonStyled>
          <ReactTooltip id="asapButton" place='bottom' effect='solid' backgroundColor={theme.bgColors.dark}>
            Place a quick cafe or grocery staples order.  Pickup orders ready in as little as 20 minutes and delivery in 1hr.
          </ReactTooltip>
        </OrderTypeButtonContainer>
      )}
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
