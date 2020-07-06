import React, { useState, useRef } from 'react'
import propTypes from 'prop-types'
import { Input } from 'open-tender'

const LoginForm = ({ loading, error, login, callback }) => {
  const [data, setData] = useState({})
  const submitButton = useRef()
  const isLoading = loading === 'pending'

  const handleChange = (evt) => {
    const { id, value } = evt.target
    setData({ ...data, [id]: value })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const { email, password } = data
    login(email, password).then(() => {
      if (callback) callback()
    })
    submitButton.current.blur()
  }

  return (
    <form id="login-form" className="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="form__error form__error--top form-error">{error}</div>
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
        <Input
          label="Password"
          name="password"
          type="password"
          value={data.password}
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

LoginForm.displayName = 'LoginForm'
LoginForm.propTypes = {
  loading: propTypes.string,
  error: propTypes.string,
  login: propTypes.func,
  callback: propTypes.func,
}

export default LoginForm
