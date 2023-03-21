import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled'
import propTypes from 'prop-types'

import {
  fetchMenu,
  revertMenu,
  selectMenu,
  selectCart,
  setCart,
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'
import { isoToDate } from '@open-tender/js'

import { closeModal } from '../../slices'
import { getLongName } from '../../utils'
import { ModalContent, ModalView } from '..'

export const InvalidView = styled.div`
  margin: 3rem 0 0;
`

export const InvalidItemsView = styled.div`
  margin: 0 0 3rem;
  > p {
    font-size: ${(props) => props.theme.fonts.sizes.small};
  }
  ul {
    list-style: disc inside;
    margin: 1.5rem 0 0;
    li {
      margin: 1rem 0;
      span:first-of-type {
        position: relative;
        left: -0.5rem;
        font-weight: ${(props) => props.theme.boldWeight};
        color: ${(props) => props.theme.colors.primary};
      }
      span + span {
        font-size: ${(props) => props.theme.fonts.sizes.small};
      }
    }
  }
`

const InvalidButtons = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  button {
    display: block;
    width: 100%;
    & + button {
      margin-top: 1rem;
    }
  }
`

const InvalidItems = ({ invalidItems }) => {
  return invalidItems.length ? (
    <InvalidItemsView>
      <p>The following subscriptions will need to be removed from your cart:</p>
      <ul>
        {invalidItems.map((item, index) => {
          return (
            <li key={`${item.id}-${index}`}>
              <span>{item.name}</span>
              <span> ({getLongName(item.frequency)})</span>
            </li>
          )
        })}
      </ul>
    </InvalidItemsView>
  ) : null
}

InvalidItems.displayName = 'InvalidItems'
InvalidItems.propTypes = {
  invalidItems: propTypes.array,
}

const isCartRevertable = (previous, current) => {
  if (!previous) return null
  const now = new Date()
  const requestedDate =
    current.requestedAt === 'asap' ? now : isoToDate(current.requestedAt)
  if (requestedDate < now) return null
  if (
    previous.revenueCenterId === current.revenueCenterId &&
    previous.serviceType === current.serviceType &&
    previous.requestedAt === current.requestedAt
  ) {
    return null
  }
  return { newMenuVars: previous }
}

const SubscriptionErrors = ({
  errors,
  revert,
  revertIcon,
  proceed,
  proceedIcon,
  previousMenuVars,
  menuVars,
}) => {
  const isRevertable = isCartRevertable(previousMenuVars, menuVars)

  const handleRevert = () => {
    const { newMenuVars } = isRevertable
    revert(newMenuVars)
  }

  return (
    <InvalidView>
      <InvalidItems invalidItems={errors} />
      <p>
        {isRevertable
          ? 'Please either remove these items or switch back to your previous menu.'
          : 'Please click the button below to remove these items and proceed with your order.'}
      </p>
      <InvalidButtons>
        {isRevertable && (
          <ButtonStyled icon={revertIcon} onClick={handleRevert}>
            Back to Previous Menu
          </ButtonStyled>
        )}
        <ButtonStyled icon={proceedIcon} onClick={proceed}>
          Remove Subscriptions
        </ButtonStyled>
      </InvalidButtons>
    </InvalidView>
  )
}

const RecurrenceErrors = () => {
  const dispatch = useDispatch()
  const cart = useSelector(selectCart)
  const { cartErrors, previousMenuVars, menuVars } = useSelector(selectMenu)
  const { newCart } = cartErrors || {}

  const [recurring] = useState(cart ? cart.filter(i => !!i.frequency) : [])

  useEffect(() => {
    if (!recurring) dispatch(closeModal())
  }, [cart, closeModal, dispatch])

  const handleRevert = (menuVars) => {
    dispatch(revertMenu(menuVars))
    dispatch(fetchMenu({ ...menuVars }))
    dispatch(closeModal())
  }

  const handleProceed = () => {
    const newCart = cart ? cart.map(item => ({...item, frequency : null})) : []

    dispatch(setCart(newCart))
    dispatch(closeModal())
  }

  return (
    <ModalView>
      <ModalContent
        title='Subcirptions Unavailable'
        subtitle={<p>Uh oh. You've switched to an order type that doesn't
          support subscriptions.</p>}
      >
        <SubscriptionErrors
          newCart={newCart}
          errors={recurring}
          revert={handleRevert}
          proceed={handleProceed}
          previousMenuVars={previousMenuVars}
          menuVars={menuVars}
        />
      </ModalContent>
    </ModalView>
  )
}

RecurrenceErrors.displayName = 'RecurrenceErrors'

export default RecurrenceErrors
