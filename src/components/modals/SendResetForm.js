import React, { useState, useRef } from 'react'
import propTypes from 'prop-types'
import { Input } from 'open-tender'

const SendResetForm = ({ loading, error, sendReset, callback }) => {
  const [data, setData] = useState({})
  const submitButton = useRef()
  const isLoading = loading === 'pending'

  const handleChange = (evt) => {
    const { id, value } = evt.target
    setData({ ...data, [id]: value })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const linkUrl = `${window.location.origin}/reset-password`
    sendReset(data.email, linkUrl).then(() => {
      if (callback) callback()
    })
    submitButton.current.blur()
  }

  return (
    <form
      id="send-reset-form"
      className="form"
      onSubmit={handleSubmit}
      noValidate
    >
      {error && error.email && (
        <div className="form__error form__error--top form-error">
          {error.email}
        </div>
      )}
      <div className="form__inputs">
        <Input
          label="Email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          required={true}
          classes="form__input"
        />
      </div>
      <div className="form__submit">
        <input
          className="btn"
          type="submit"
          value={isLoading ? 'Submitting' : 'Submit'}
          disabled={isLoading}
          ref={submitButton}
        />
      </div>
    </form>
  )
}

SendResetForm.displayName = 'SendResetForm'
SendResetForm.propTypes = {
  loading: propTypes.string,
  error: propTypes.object,
  sendReset: propTypes.func,
  callback: propTypes.func,
}

export default SendResetForm
