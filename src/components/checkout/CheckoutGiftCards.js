import React, { useContext } from 'react'
import { Button, CircleLoader } from 'open-tender'
import { checkAmountRemaining } from 'open-tender-js'
import { FormContext } from './CheckoutForm'
import { CheckoutLineItem } from '.'

const CheckoutGiftCardLabel = ({ giftCard, amount }) => {
  return (
    <span className="form__input__discount">
      <span className="font-size ot-bold">
        Gift Card {giftCard.card_number}
      </span>
      <span className="font-size-small ot-success-color">
        Balance of ${giftCard.balance}{' '}
        {amount && `($${amount} applied to check)`}
      </span>
    </span>
  )
}

const CheckoutGiftCards = () => {
  const formContext = useContext(FormContext)
  const { config, check, form, updateForm } = formContext

  const giftCards =
    check.customer && check.customer.gift_cards
      ? check.customer.gift_cards
      : null
  if (!giftCards) return null
  const giftCardsApplied = form.tenders
    .filter((i) => i.tender_type === 'GIFT_CARD')
    .reduce((obj, i) => ({ ...obj, [i.card_number]: i.amount }), {})
  const amountRemaining = checkAmountRemaining(check.totals.total, form.tenders)
  const isPaid = Math.abs(amountRemaining).toFixed(2) === '0.00'

  const applyGiftCard = (evt, cardNumber, balance) => {
    evt.preventDefault()
    const remaining = checkAmountRemaining(check.totals.total, form.tenders)
    const amount = Math.min(remaining, parseFloat(balance)).toFixed(2)
    const newGiftCard = {
      tender_type: 'GIFT_CARD',
      card_number: cardNumber,
      balance: balance,
      amount: amount,
    }
    updateForm({ tenders: [...form.tenders, newGiftCard] })
    evt.target.blur()
  }

  const removeGiftCard = (evt, cardNumber) => {
    evt.preventDefault()
    // const removed = form.tenders.find((i) => i.card_number === cardNumber)
    const filtered = form.tenders.filter((i) => i.card_number !== cardNumber)
    const nonGiftCard = filtered.filter((i) => i.tender_type !== 'GIFT_CARD')
    const giftCard = filtered.filter((i) => i.tender_type === 'GIFT_CARD')
    let remaining = checkAmountRemaining(check.totals.total, nonGiftCard)
    const adjusted = giftCard.map((i) => {
      const newAmount = Math.min(remaining, parseFloat(i.balance))
      remaining -= newAmount
      return { ...i, amount: newAmount.toFixed(2) }
    })
    const nonZero = adjusted.filter((i) => i.amount !== '0.00')
    const adjustedOther = nonGiftCard.map((i) => {
      const newAmount = parseFloat(i.amount) + remaining
      remaining = 0.0
      return { ...i, amount: newAmount.toFixed(2) }
    })
    const nonZeroOther = adjustedOther.filter((i) => i.amount !== '0.00')
    updateForm({ tenders: [...nonZeroOther, ...nonZero] })
    evt.target.blur()
  }

  return (
    <fieldset className="form__fieldset">
      <div className="form__legend">
        <p className="form__legend__title heading ot-font-size-h3">
          {config.giftCards.title}
        </p>
        <p className="form__legend__subtitle">{config.giftCards.subtitle}</p>
      </div>
      <div className="form__inputs">
        {giftCards.map((i) => {
          const amount = giftCardsApplied[i.card_number]
          return (
            <CheckoutLineItem
              key={i.card_number}
              label={<CheckoutGiftCardLabel giftCard={i} amount={amount} />}
            >
              <div className="input__wrapper">
                {amount ? (
                  <>
                    <span className="input__success">
                      <CircleLoader complete={true} />
                    </span>
                    <Button
                      text="Remove Gift Card"
                      ariaLabel={`Remove gift card ${i.card_number} with amount of ${amount}`}
                      icon="XCircle"
                      classes="btn--header"
                      onClick={(evt) => removeGiftCard(evt, i.card_number)}
                    />
                  </>
                ) : (
                  <Button
                    text="Apply Gift Card"
                    ariaLabel={`Apply gift card ${i.card_number} with balance of ${i.balance}`}
                    icon="PlusCircle"
                    classes="btn--header"
                    onClick={(evt) =>
                      applyGiftCard(evt, i.card_number, i.balance)
                    }
                    disabled={isPaid}
                  />
                )}
              </div>
            </CheckoutLineItem>
          )
        })}
      </div>
    </fieldset>
  )
}

CheckoutGiftCards.displayName = 'CheckoutGiftCards'

export default CheckoutGiftCards
