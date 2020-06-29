import React from 'react'
import propTypes from 'prop-types'
import {
  timezoneMap,
  makeRequestedAtStr,
  makeEstimatedTime,
} from 'open-tender-js'
import { RequestedAtPicker } from 'open-tender'

const RequestedAtCalendar = ({
  forcedUpdate,
  requestedAt,
  serviceType,
  revenueCenter,
  setRequestedAt,
  handleClose,
}) => {
  const tz = timezoneMap[revenueCenter.timezone]
  const estimatedTime = makeEstimatedTime(
    requestedAt,
    revenueCenter,
    serviceType
  )
  const requestedAtText = makeRequestedAtStr(requestedAt, tz, true)
  const requestedTime = `${requestedAtText}${
    estimatedTime ? ` (${estimatedTime})` : ''
  }`
  return (
    <div className="modal__content">
      {forcedUpdate ? (
        <div className="modal__header">
          <p className="modal__title heading ot-font-size-h3">
            Order date & time updated
          </p>
          <p className="modal__subtitle ot-bold ot-alert-color">
            Your previous order time is no longer available and has been updated
            to {requestedTime}.
          </p>
        </div>
      ) : (
        <div className="modal__header">
          <p className="modal__title heading ot-font-size-h3">
            Choose an order date & time
          </p>
          <p className="modal__subtitle ot-bold ot-alert-color">
            Your current order time is {requestedTime}.
          </p>
        </div>
      )}
      <div className="modal__body">
        <p className="font-size-small">
          <button className="btn-link" onClick={handleClose}>
            Keep this time
          </button>{' '}
          or use the calendar below to choose a different day & time.
        </p>
        {revenueCenter && (
          <RequestedAtPicker
            requestedAt={requestedAt}
            serviceType={serviceType}
            revenueCenter={revenueCenter}
            setRequestedAt={setRequestedAt}
          />
        )}
      </div>
    </div>
  )
}

RequestedAtCalendar.displayName = 'RequestedAtCalendar'
RequestedAtCalendar.propTypes = {
  forcedUpdate: propTypes.bool,
  requestedAt: propTypes.string,
  serviceType: propTypes.string,
  revenueCenter: propTypes.object,
  handleClose: propTypes.func,
  setRequestedAt: propTypes.func,
}

export default RequestedAtCalendar
