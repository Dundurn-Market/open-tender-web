import React from 'react'
import propTypes from 'prop-types'
import {
  makeOrderTimes,
  time24ToDateStr,
  timezoneMap,
} from '../packages/utils/datetimes'
import { capitalize } from '../packages/utils/helpers'
import { Button } from '../packages'

const RequestedAtTimes = ({
  orderTimes,
  revenueCenter,
  requestedAt,
  setRequestedAt,
}) => {
  const tz = timezoneMap[revenueCenter.timezone]
  const availableTimes = makeOrderTimes(orderTimes, tz)

  const handleRequestedAt = (evt, requestedAt) => {
    evt.preventDefault()
    setRequestedAt(requestedAt)
    evt.target.blur()
  }

  return (
    <div className="modal__content">
      <div className="modal__header">
        <p className="modal__title heading ot-font-size-h3">
          Choose an order time
        </p>
        <p className="modal__subtitle">
          Please select from the available pickup times below
        </p>
      </div>
      <div className="modal__body">
        <ul className="order-times">
          {availableTimes.map((i) => {
            const { weekday, time } = i.order_by
            const orderBy = `${capitalize(weekday)} at ${time24ToDateStr(time)}`
            const current = requestedAt === i.iso
            return (
              <li
                key={i.iso}
                className={`order-time border-color ${
                  current ? '-current' : ''
                }`}
              >
                <div className="order-time__container">
                  <div className="order-time__time">
                    <p className={current ? 'ot-bold' : ''}>
                      {capitalize(i.weekday)} @ {time24ToDateStr(i.start_time)}{' '}
                      {current ? '(current)' : ''}
                    </p>
                    <p className="order-time__order-by font-size-small secondary-color">
                      {' '}
                      (order by {orderBy})
                    </p>
                  </div>
                  <Button
                    text={current ? 'Keep' : 'Select'}
                    classes={current ? 'btn btn--highlight' : 'btn'}
                    onClick={(evt) => handleRequestedAt(evt, i.iso)}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

RequestedAtTimes.displayName = 'RequestedAtTimes'
RequestedAtTimes.propTypes = {
  orderTimes: propTypes.object,
  revenueCenter: propTypes.object,
  handleClose: propTypes.func,
  setRequestedAt: propTypes.func,
}

export default RequestedAtTimes
