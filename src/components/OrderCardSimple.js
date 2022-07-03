import React from 'react'
import propTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import {
  timezoneMap,
  isoToDateStr,
  isoToDate,
  makeOrderTypeName,
} from '@open-tender/js'
import { BgImage, Box, Heading } from '@open-tender/components'

import { Tag } from '.'

const OrderCardSimpleButton = styled.button`
  display: block;
  width: 100%;
  height: 100%;
  text-align: left;
`

const OrderCardSimpleView = styled(Box)`
  position: relative;
  overflow: hidden;
`

const OrderCardSimpleTag = styled.div`
  position: absolute;
  top: -0.9rem;
  right: 1rem;

  & > span {
    padding: 0.3rem 1rem 0.4rem;
  }
`

const OrderCardSimpleImage = styled(BgImage)`
  width: 100%;
  padding: 37.5% 0;
  background-color: ${(props) => props.theme.bgColors.tertiary};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 33.33333% 0;
  }
`

const OrderCardSimpleContent = styled.div`
  padding: 0.8rem 0 0;
`

const OrderCardSimpleTitle = styled(Heading)`
  font-size: ${(props) => props.theme.fonts.sizes.small};
`

const OrderCardSimpleDescription = styled('p')`
  margin: 0.5rem 0 0;
  line-height: ${(props) => props.theme.fonts.body.lineHeight};
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
`

const OrderCardSimple = ({ order }) => {
  const navigate = useNavigate()
  const {
    order_id,
    service_type,
    order_type,
    revenue_center,
    requested_at,
    timezone,
    cart,
  } = order
  const orderTypeName = makeOrderTypeName(order_type, service_type)
  const tz = timezoneMap[timezone]
  const requestedAt = isoToDateStr(requested_at, tz, 'MMMM d, yyyy')
  const isUpcoming = isoToDate(requested_at) > new Date()
  const sorted = cart.sort(
    (a, b) => parseFloat(b.price_total) - parseFloat(a.price_total)
  )
  const itemImages = sorted
    .map((i) =>
      i.images
        .filter((m) => m.type === 'SMALL_IMAGE' && m.url)
        .map((image) => ({ title: i.name, imageUrl: image.url }))
    )
    .flat()
  const bgStyle = itemImages.length
    ? { backgroundImage: `url(${itemImages[0].imageUrl}` }
    : null

  return (
    <OrderCardSimpleButton
      onClick={() => navigate(`/orders/${order_id}`)}
      label={`View details of order #${order_id}`}
    >
      <OrderCardSimpleView>
        <OrderCardSimpleTag>
          {isUpcoming && <Tag text="Coming Up" icon={null} bgColor="alert" />}
        </OrderCardSimpleTag>
        <OrderCardSimpleImage style={bgStyle}>&nbsp;</OrderCardSimpleImage>
        <OrderCardSimpleContent>
          <OrderCardSimpleTitle as="p">
            {orderTypeName} from {revenue_center.name}
          </OrderCardSimpleTitle>
          <OrderCardSimpleDescription>
            Ordered on {requestedAt}
          </OrderCardSimpleDescription>
        </OrderCardSimpleContent>
      </OrderCardSimpleView>
    </OrderCardSimpleButton>
  )
}

OrderCardSimple.displayName = 'OrderCardSimple'
OrderCardSimple.propTypes = {
  order: propTypes.object,
}

export default OrderCardSimple