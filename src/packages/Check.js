import React, { useState, useRef, useEffect } from 'react'
import propTypes from 'prop-types'
import { formatDollars } from './utils'
import BarLoader from 'react-spinners/BarLoader'

const CheckItem = ({ label, value, classes = '' }) => (
  <li className={`check__item border-color ${classes}`}>
    <span>{label}</span>
    <span>{formatDollars(value)}</span>
  </li>
)

CheckItem.displayName = 'CheckItem'
CheckItem.propTypes = {
  name: propTypes.string,
  value: propTypes.string,
  unit: propTypes.string,
}

const CheckUpdating = () => (
  <div className="check__disabled overlay">
    <div className="check__disabled__working">
      <BarLoader size={36} color={'#000'} />
      <span>Updating...</span>
    </div>
  </div>
)

const Check = ({ title, totals, updating = false }) => {
  const [isSticky, setSticky] = useState(false)
  const stickyRef = useRef(null)
  const handleScroll = () => {
    if (stickyRef.current) {
      setSticky(stickyRef.current.getBoundingClientRect().top <= 110)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', () => handleScroll)
    }
  }, [])
  const stuckClass = isSticky ? 'stuck' : ''

  const {
    subtotal,
    surcharges,
    surcharge,
    discounts,
    discount,
    taxes,
    tip,
    shipping,
    total,
  } = totals
  const totalBeforeTax = [subtotal, surcharge, discount]
    .reduce((t, i) => (t += parseFloat(i)), 0.0)
    .toFixed(2)

  return (
    <div
      className={`check border-radius bg-color ${stuckClass}`}
      ref={stickyRef}
    >
      <div className="check__container">
        {updating && <CheckUpdating />}
        <h2 className="check__title ot-font-size-h4">{title}</h2>
        <ul className="check__items">
          <CheckItem label="Subtotal" value={subtotal} />
          {surcharges.map((surcharge) => (
            <CheckItem
              key={surcharge.surcharge_id}
              label={surcharge.name}
              value={surcharge.amount}
            />
          ))}
          {discounts.map((discount) => (
            <CheckItem
              key={discount.discount_id}
              label={`Discount: ${discount.name}`}
              value={discount.amount}
            />
          ))}
          {subtotal !== totalBeforeTax && (
            <CheckItem
              label="Total before Tax"
              value={totalBeforeTax}
              classes="check__item--total"
            />
          )}
          {taxes.map((tax) => (
            <CheckItem key={tax.tax_id} label={tax.name} value={tax.amount} />
          ))}
          <CheckItem label="Tip" value={tip} />
          {shipping !== '0.00' && (
            <CheckItem label="Shipping" value={shipping} />
          )}
          <CheckItem
            label="Total"
            value={total}
            classes="check__item--grand-total ot-bold"
          />
        </ul>
      </div>
    </div>
  )
}

Check.displayName = 'Check'
Check.propTypes = {
  title: propTypes.string,
  totals: propTypes.object,
}

export default Check
