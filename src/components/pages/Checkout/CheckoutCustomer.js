import { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import {
  logoutCustomer,
  resetCheckout,
  selectCheckout,
  selectCustomer,
  updateForm,
  validateOrder,
} from '@open-tender/redux'
import { isEmpty } from '@open-tender/js'
import { ButtonLink } from '@open-tender/components'

import CheckoutSection from './CheckoutSection'
import { selectBrand } from '../../../slices'
import { Loading } from '../..'

const CheckoutCustomerSignOut = styled('div')`
  label: CheckoutCustomerSignOut;
  margin: ${(props) => props.theme.layout.padding} 0 0;

  p {
    font-size: ${(props) => props.theme.fonts.sizes.small};
  }
`

const CheckoutCustomer = ({ errors }) => {
  const dispatch = useDispatch()
  const { has_thanx } = useSelector(selectBrand)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { auth, profile } = useSelector(selectCustomer)
  const { form, check } = useSelector(selectCheckout)
  const { sso } = check ? check.customer || {} : {}
  const noCustomer = isEmpty(form.customer)
  const { customer_id, first_name, last_name, email, phone, company } =
    profile || {}
  const noCustomerId = customer_id && !form.customer.customer_id
  const showCustomer = check && profile

  useEffect(() => {
    if (!isLoggingOut) {
      if (noCustomer || noCustomerId) {
        const customer = {
          customer_id,
          first_name,
          last_name,
          email,
          phone,
          company,
        }
        dispatch(updateForm({ customer }))
      } else {
        dispatch(validateOrder())
      }
    }
  }, [
    dispatch,
    noCustomer,
    noCustomerId,
    customer_id,
    first_name,
    last_name,
    email,
    phone,
    company,
    isLoggingOut,
  ])

  useEffect(() => {
    if (has_thanx && customer_id && sso && !sso.connected) {
      dispatch(logoutCustomer())
    }
  }, [has_thanx, customer_id, sso, dispatch])

  const signOut = () => {
    setIsLoggingOut(true)
    dispatch(resetCheckout())
    dispatch(logoutCustomer())
  }

  if (!auth) return null

  return showCustomer ? (
    <CheckoutSection>
      <h4>Contact Information</h4>
      <p>
        {first_name} {last_name}
      </p>
      <p>{email}</p>
      <p>{phone}</p>
      <CheckoutCustomerSignOut>
        <p>
          <ButtonLink onClick={signOut}>Update your contact info</ButtonLink> or{' '}
          <ButtonLink onClick={signOut}>sign out</ButtonLink> to sign into a
          different account or checkout as a guest.
        </p>
      </CheckoutCustomerSignOut>
      {/* {check && <CheckoutCompany errors={errors} />} */}
    </CheckoutSection>
  ) : (
    !isLoggingOut && (
      <CheckoutSection>
        <Loading text="Retrieving your info..." style={{ textAlign: 'left' }} />
      </CheckoutSection>
    )
  )
}

CheckoutCustomer.displayName = 'CheckoutCustomer'
CheckoutCustomer.propTypes = {
  errors: propTypes.object,
}

export default CheckoutCustomer
