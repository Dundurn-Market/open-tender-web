import React from 'react'
import propTypes from 'prop-types'
import { DeliveryLink } from '@open-tender/components'

const OrderAddress = ({ address, delivery, status, isDefault, children }) => {
  const { street, unit, city, state, postal_code, company, contact, phone } =
    address || {}
  const streetAddress = street ? `${street}${unit ? `, ${unit}` : ''}` : null
  const contactPhone =
    contact || phone ? [contact, phone].filter((i) => i).join(' @ ') : null
  const trackingUrl = status === 'OPEN' && delivery && delivery.tracking_url
  return (
    <>
      {company ? (
        <>
          <p>{company}</p>
          <p>{streetAddress}</p>
        </>
      ) : streetAddress ? (
        <p>{streetAddress}</p>
      ) : (
        <p>{postal_code}</p>
      )}
      <p>
        {city}, {state} {postal_code}
      </p>
      {contactPhone && <p>{contactPhone}</p>}
      {trackingUrl && (
        <p>
          <DeliveryLink
            text="Check delivery status"
            trackingUrl={trackingUrl}
          />
        </p>
      )}
      {children}
    </>
  )
}

OrderAddress.displayName = 'OrderAddress'
OrderAddress.propTypes = {
  address: propTypes.object,
  delivery: propTypes.object,
  status: propTypes.string,
  isDefault: propTypes.bool,
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]),
}

export default OrderAddress
