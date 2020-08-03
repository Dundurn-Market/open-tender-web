import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@open-tender/components'

import { openModal, closeModal } from '../slices'

const GroupOrderGuest = () => {
  const dispatch = useDispatch()

  const login = (evt, type) => {
    evt.preventDefault()
    dispatch(closeModal())
    setTimeout(() => {
      dispatch(openModal({ type }))
    }, 250)
    evt.target.blur()
  }

  const cancel = (evt) => {
    evt.preventDefault()
    dispatch(closeModal())
    evt.target.blur()
  }

  return (
    <div className="modal__content">
      <div className="modal__header">
        <p className="modal__title ot-heading ot-font-size-h3">
          Start a group order
        </p>
      </div>
      <div className="modal__body -message">
        <div className="modal__body__section">
          <p>You must be logged into your accout to start a group order.</p>
          <p>
            <Button
              text="Click here to login."
              classes="ot-btn-link"
              onClick={(evt) => login(evt, 'login')}
            />
          </p>
        </div>
        <div className="modal__body__section">
          <p>Don't have an account?</p>
          <p>
            <Button
              text="Click here to create one."
              classes="ot-btn-link"
              onClick={(evt) => login(evt, 'signUp')}
            />
          </p>
        </div>
      </div>
      <div className="modal__footer">
        <div className="modal__footer__buttons">
          <Button
            text="Nevermind"
            classes="ot-btn ot-btn--highlight"
            onClick={cancel}
          />
        </div>
      </div>
    </div>
  )
}

GroupOrderGuest.displayName = 'GroupOrderGuest'

export default GroupOrderGuest