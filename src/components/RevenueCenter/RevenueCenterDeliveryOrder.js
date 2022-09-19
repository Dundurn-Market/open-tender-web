import propTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'
import {
  setOrderServiceType,
  setAddress,
  setRevenueCenter, setRequestedAt
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'
import { openModal } from '../../slices'

export const RevenueCenterDeliveryOrder = ({ revenueCenters, orderType, isGroupOrder, setShowDeliveryOptions }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const scheduledDeliveryZone = revenueCenters[0]
  const hasAsapDelivery = revenueCenters.length > 1
  const asapDeliveryCenters = hasAsapDelivery? revenueCenters.slice(1) : null

  const settings = scheduledDeliveryZone.settings || scheduledDeliveryZone

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
    if (asapDeliveryCenters.length === 1) {
      dispatch(setRequestedAt('asap'))
      dispatch(setRevenueCenter(asapDeliveryCenters[0]))
      dispatch(setOrderServiceType(asapDeliveryCenters[0].revenue_center_type, 'DELIVERY'))
      navigate(`/menu/${asapDeliveryCenters[0].slug}`)
    } else {
      setShowDeliveryOptions(true)
    }

  }

  const orderLater = () => {
    const args = {
      focusFirst: true,
      skipClose: true,
      //TODO not sure if we should support scheduled group orders.. for now, NO
      isGroupOrder: false,
      //isGroupOrder: isGroupOrder || cartId ? true : false,
      style: scheduledDeliveryZone.orderTimes ? { alignItems: 'flex-start' } : {},
      revenueCenter: scheduledDeliveryZone,
      serviceType: 'DELIVERY',
      orderType,
    }
    setShowDeliveryOptions(false)
    dispatch(openModal({ type: 'requestedAt', args }))
  }

  return (
    <>
      <ButtonStyled
        label={`Schedule a delivery`}
        onClick={orderLater}
        size={isMobileOnly ? 'small' : 'default'}
        style={{"marginRight": '1.5rem'}}
      >
        Schedule Delivery
      </ButtonStyled>
      {hasAsapDelivery && (
        <ButtonStyled
          label={`Order Quick Delivery`}
          onClick={orderAsap}
          size={isMobileOnly ? 'small' : 'default'}
        >
          Order Quick Delivery
        </ButtonStyled>
      )}
    </>
  )
}

RevenueCenterDeliveryOrder.displayName = 'RevenueCenterDeliveryOrder'
RevenueCenterDeliveryOrder.propTypes = {
  revenueCenter: propTypes.array,
  orderType: propTypes.object,
  isGroupOrder: propTypes.bool,
  setShowDeliveryOptions: propTypes.func
}

export default RevenueCenterDeliveryOrder
