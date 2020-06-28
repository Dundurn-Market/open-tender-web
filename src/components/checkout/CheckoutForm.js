import React, { useRef, createContext, useEffect } from 'react'
import propTypes from 'prop-types'
import { checkAmountRemaining } from 'open-tender-js'
import { Error } from 'open-tender'
import {
  CheckoutAddress,
  CheckoutCustomer,
  CheckoutDetails,
  CheckoutDiscounts,
  CheckoutGiftCards,
  CheckoutPromoCodes,
  CheckoutSurcharges,
  CheckoutTenders,
} from '.'

export const FormContext = createContext(null)

const adjustTenders = (tenders, isPaid, amountRemaining, updateForm) => {
  if (!tenders.length || isPaid) return
  const gift = tenders.filter((i) => i.tender_type === 'GIFT_CARD')
  const nonGift = tenders.filter((i) => i.tender_type !== 'GIFT_CARD')
  if (amountRemaining > 0) {
    if (!nonGift.length) return
    const newTenders = nonGift.map((i) => {
      const newAmount = parseFloat(i.amount) + amountRemaining
      amountRemaining = 0.0
      return { ...i, amount: newAmount.toFixed(2) }
    })
    updateForm({ tenders: [...gift, ...newTenders] })
    isPaid = Math.abs(amountRemaining).toFixed(2) === '0.00'
  } else {
    const newTenders = nonGift.map((i) => {
      const newAmount = Math.max(parseFloat(i.amount) + amountRemaining, 0.0)
      amountRemaining += parseFloat(i.amount) - newAmount
      return { ...i, amount: newAmount.toFixed(2) }
    })
    isPaid = Math.abs(amountRemaining).toFixed(2) === '0.00'
    if (isPaid) {
      const nonZero = newTenders.filter((i) => i.amount !== '0.00')
      updateForm({ tenders: [...gift, ...nonZero] })
    } else {
      const newGift = gift.map((i) => {
        const newAmount = Math.max(parseFloat(i.amount) + amountRemaining, 0.0)
        amountRemaining += parseFloat(i.amount) - newAmount
        return { ...i, amount: newAmount.toFixed(2) }
      })
      const allNew = [...newGift, ...newTenders].filter(
        (i) => i.amount !== '0.00'
      )
      updateForm({ tenders: allNew })
      isPaid = Math.abs(amountRemaining).toFixed(2) === '0.00'
    }
  }
}

const CheckoutForm = ({
  config,
  autoSelect,
  order,
  tz,
  check,
  form,
  loading,
  errors,
  updateForm,
  submitting,
  setSubmitting,
  submitOrder,
  login,
  logout,
  updateRequestedAt,
  updateRevenueCenter,
  updateServiceType,
}) => {
  const submitButton = useRef()
  const { total } = check ? check.totals : 0.0
  const { tenders } = form
  let amountRemaining = checkAmountRemaining(total, tenders)
  let isPaid = Math.abs(amountRemaining).toFixed(2) === '0.00'
  const isDelivery = order.serviceType === 'DELIVERY'
  const hasGiftCardTender = check.config.tender_types.includes('GIFT_CARD')

  useEffect(() => {
    adjustTenders(tenders, isPaid, amountRemaining, updateForm)
  }, [tenders, isPaid, amountRemaining, updateForm])

  if (!check || !check.config) return null

  const handleSubmit = (evt) => {
    evt.preventDefault()
    setSubmitting(true)
    submitOrder()
    submitButton.current.blur()
  }

  return (
    <FormContext.Provider
      value={{
        config,
        autoSelect,
        order,
        tz,
        check,
        form,
        loading,
        errors,
        updateForm,
        submitOrder,
        login,
        logout,
        updateRequestedAt,
        updateRevenueCenter,
        updateServiceType,
      }}
    >
      <form
        id="checkout-form"
        className="form"
        onSubmit={handleSubmit}
        noValidate
      >
        {errors.form && (
          <div className="form__error--top">
            <Error error={errors.form} />
          </div>
        )}
        <CheckoutCustomer />
        <CheckoutDetails />
        {isDelivery && <CheckoutAddress />}
        <CheckoutSurcharges />
        <CheckoutDiscounts />
        <CheckoutPromoCodes />
        {hasGiftCardTender && <CheckoutGiftCards />}
        <CheckoutTenders />
        <div className="form__footer">
          <div className="form__message">
            {!isPaid ? (
              <div className="form__message__content border-radius-small ot-error font-size-small">
                <p>
                  There is a balance of ${amountRemaining.toFixed(2)} remaining
                  on your order. Please add a payment above.
                </p>
              </div>
            ) : null}
            {/* {(
              <div className="form__message__content border-radius-small ot-success font-size-small">
                <p>Your order can now be submitted. Go for it!</p>
              </div>
            )} */}
          </div>
          <input
            className="btn btn--big"
            type="submit"
            value="Submit Order"
            disabled={submitting || !isPaid}
            ref={submitButton}
          />
        </div>
      </form>
    </FormContext.Provider>
  )
}

CheckoutForm.displayName = 'CheckoutForm'
CheckoutForm.propTypes = {
  config: propTypes.object,
  order: propTypes.object,
  check: propTypes.object,
  form: propTypes.object,
  loading: propTypes.string,
  errors: propTypes.object,
  updateForm: propTypes.func,
  submitOrder: propTypes.func,
  login: propTypes.func,
  logout: propTypes.func,
}

export default CheckoutForm
