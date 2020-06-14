import React, { useState, useEffect, useCallback, useContext } from 'react'
import debounce from 'lodash/debounce'
import { Input } from './Inputs'
import CheckoutLineItem from './CheckoutLineItem'
import { FormContext } from './CheckoutForm'
import ButtonAddress from './ButtonAddress'
import { isEmpty } from './utils/helpers'

const initialState = {
  unit: '',
  company: '',
  contact: '',
  phone: '',
}

const makeAddressConfig = (requiredFields) => {
  return {
    unit: {
      label: 'Unit / Suite',
      included: requiredFields.includes('unit'),
      required: requiredFields.includes('unit'),
    },
    company: {
      label: 'Company',
      included: requiredFields.includes('company'),
      required: requiredFields.includes('company'),
    },
    contact: {
      label: 'Contact Person',
      included: requiredFields.includes('contact'),
      required: requiredFields.includes('contact'),
    },
    phone: {
      label: 'Contact Phone',
      included: requiredFields.includes('phone'),
      required: requiredFields.includes('phone'),
    },
  }
}

const fields = [
  { name: 'unit', type: 'text' },
  { name: 'company', type: 'text' },
  { name: 'contact', type: 'text' },
  { name: 'phone', type: 'text' },
]

const CheckoutAddress = () => {
  const formContext = useContext(FormContext)
  const {
    config,
    order,
    check,
    form,
    errors,
    updateForm,
    updateLocation,
  } = formContext
  const [address, setAddress] = useState(form.address || initialState)
  const requiredFields = check.config.required.address
  const addressConfig = makeAddressConfig(requiredFields)
  const addressErrors = errors.address || {}

  // useEffect(() => {
  //   if (isEmpty(form.address) && check.address) {
  //     setAddress(check.address)
  //     updateForm({ details: check.address })
  //   }
  // }, [form.address, check.address, updateForm])

  const debouncedUpdate = useCallback(
    debounce((newAddress) => updateForm({ address: newAddress }), 500),
    []
  )

  const handleChange = (evt) => {
    const { id, value } = evt.target
    const field = id.replace('address-', '')
    const newAddress = { ...address, [field]: value }
    setAddress(newAddress)
    debouncedUpdate(newAddress)
  }

  return (
    <fieldset className="form__fieldset">
      <legend className="form__legend">
        <p className="form__legend__title heading ot-font-size-h3">
          {config.address.title}
        </p>
      </legend>
      <div className="form__inputs">
        <CheckoutLineItem label="Location">
          <ButtonAddress
            address={order.address}
            onClick={updateLocation}
            classes="btn--header"
          />
        </CheckoutLineItem>
        {fields.map((field) => {
          const input = addressConfig[field.name]
          return (
            input &&
            input.included && (
              <Input
                key={field.name}
                label={input.label}
                name={`address-${field.name}`}
                type={field.type}
                value={address[field.name]}
                onChange={handleChange}
                error={addressErrors[field.name]}
                required={input.required}
              />
            )
          )
        })}
      </div>
    </fieldset>
  )
}

CheckoutAddress.displayName = 'CheckoutAddress'

export default CheckoutAddress
