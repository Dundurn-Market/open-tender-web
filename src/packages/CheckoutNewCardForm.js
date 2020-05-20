import React, { useState } from 'react'
import propTypes from 'prop-types'
import Button from './Button'
import { Input, Checkbox } from './Inputs'
import { cardIcons, cardNames } from './constants'
import { getCardType, makeAcctNumber, validateCreditCard } from './utils'

// https://github.com/muffinresearch/payment-icons
// https://github.com/jasminmif/react-interactive-paycard

const initialState = {
  acct: '',
  exp: '',
  cvv: '',
  zip: '',
  save: true,
}

const fields = [
  {
    label: 'Card Number',
    placeholder: '#### #### #### ####',
    name: 'acct',
    type: 'text',
  },
  { label: 'Expiration', placeholder: 'MMYY', name: 'exp', type: 'number' },
  { label: 'CVV', placeholder: '###', name: 'cvv', type: 'number' },
  { label: 'Zip Code', placeholder: '#####', name: 'zip', type: 'number' },
]

const CheckoutNewCardForm = ({ addTender, setShowNewCard }) => {
  const [newCard, setNewCard] = useState(initialState)
  const [cardType, setCardType] = useState('OTHER')
  const [errors, setErrors] = useState({})

  const handleChange = (evt) => {
    let { id, checked, value } = evt.target
    if (id === 'acct') {
      const currentType = getCardType(value.replace(/\s/g, ''))
      setCardType(currentType)
      value = makeAcctNumber(value, currentType)
    } else if (id === 'exp') {
      value = value.slice(0, 4)
    } else if (id === 'cvv') {
      value = value.slice(0, 4)
    } else if (id === 'zip') {
      value = value.slice(0, 5)
    } else if (id === 'save') {
      value = checked
    }
    setNewCard({ ...newCard, [id]: value })
  }

  const submitTender = (evt) => {
    const { card, errors } = validateCreditCard(newCard, cardType)
    if (errors) {
      setErrors(errors)
    } else {
      const tender = {
        ...card,
        tender_type: 'CREDIT',
        card_type: cardType,
        card_type_name: cardNames[cardType],
        last4: newCard.acct.slice(-4),
      }
      addTender(evt, tender)
      setShowNewCard(false)
    }
  }

  const emptyFields =
    Object.values(newCard).filter((i) => typeof i !== 'boolean' && !i.length)
      .length > 0
  const cardErrors = Object.entries(errors)

  return (
    <div className="cards__new">
      <div className="cards__new__container bg-color border-radius">
        <div className="cards__new__header">
          <p className="cards__new__title font-size-big ot-bold">
            Add a new card
          </p>
          <div className="cards__new__image">
            <img src={cardIcons[cardType]} alt={cardNames[cardType]} />
          </div>
        </div>
        <div className="cards__new__content">
          {cardErrors.length ? (
            <div className="cards__new__errors">
              <span className="form-error">
                {cardErrors.map(([field, msg]) => (
                  <p key={field}>{msg}</p>
                ))}
              </span>
            </div>
          ) : null}
          {fields.map((field) => {
            return (
              <Input
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={newCard[field.name]}
                placeholder={field.placeholder}
                onChange={handleChange}
                error={null}
                required={true}
                classes={`cards__new__${field.name}`}
              />
            )
          })}
        </div>
        <div className="cards__new__save">
          <Checkbox
            label="Save card to account"
            id="save"
            on={newCard.save}
            onChange={handleChange}
          />
        </div>
        <div className="cards__new__footer">
          <Button
            text="Add New Card"
            // icon="PlusCirlce"
            classes="btn btn--cart"
            onClick={submitTender}
            disabled={emptyFields}
          />
          <Button
            text="Cancel"
            ariaLabel="Cancel Add New Card"
            // icon="XCircle"
            classes="btn"
            onClick={() => setShowNewCard(false)}
          />
        </div>
      </div>
    </div>
  )
}

CheckoutNewCardForm.displayName = 'CheckoutNewCardForm'
CheckoutNewCardForm.propTypes = {
  addTender: propTypes.func,
  setShowNewCard: propTypes.func,
}

export default CheckoutNewCardForm
