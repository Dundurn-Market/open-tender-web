import { isEmpty } from '@open-tender/js'

const isNum = (s) => /^\d+$/.test(s)

export const validateCreditCard = (card, cardType) => {
  const errors = {}
  let { acct, exp, cvv, zip } = card

  const acctLength = cardType === 'AMEX' ? 15 : 16
  acct = acct ? acct.replace(/\s/g, '') : ''
  if (acct.length !== acctLength) {
    errors.acct = `Card number must be ${acctLength} digits`
  } else if (!isNum(acct)) {
    errors.acct = 'Card number must be only numbers'
  }

  exp = (exp ? exp.replace(/\s/g, '') : '').replace('/', '').padStart(4, '0')
  const expMonth = exp.slice(0, 2)
  const expYear = exp.slice(2, 4)
  if (!isNum(exp) || exp.length !== 4) {
    errors.exp = 'Expiration must be 4 digits in MMYY format'
  } else if (expMonth < 1 || expMonth > 12) {
    errors.exp = 'Expiration month must be number between 1 and 12'
  } else if (expYear < 20) {
    errors.exp = 'Expiration year must be 2020 or later'
  }

  const cvvLength = cardType === 'AMEX' ? 4 : 3
  cvv = cvv ? cvv.replace(/\s/g, '') : ''
  if (cvv.length !== cvvLength) {
    errors.cvv = `CVV must be ${cvvLength} digits for this card type`
  } else if (!isNum(cvv)) {
    errors.cvv = 'CVV must be only numbers'
  }

  zip = zip ? zip.toUpperCase() : ''
  zip = zip.replace(/\s/g, '')
  if (zip.length !== 6) {
    errors.zip = 'Postal code must be 6 characters'
  } else if (!/^([A-Z][0-9]){3}$/.test(zip)) {
    errors.zip = 'Postal code must be alternating alphanumeric characters'
  }

  if (!isEmpty(errors)) {
    return { card, errors }
  }
  card = { ...card, acct, exp, cvv, zip }
  return { card, errors: null }
}
