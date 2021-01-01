import React from 'react'
import { useDispatch } from 'react-redux'
import { ButtonLink, ButtonStyled } from '@open-tender/components'

import { openModal, closeModal } from '../../../slices'
import iconMap from '../../iconMap'
import { ModalContent } from '../../Modal'

const GroupOrderGuest = () => {
  const dispatch = useDispatch()

  const login = (type) => {
    dispatch(closeModal())
    setTimeout(() => {
      dispatch(openModal({ type }))
    }, 300)
  }

  return (
    <ModalContent
      title="Start a group order"
      footer={
        <div>
          <ButtonStyled onClick={() => dispatch(closeModal())}>
            Nevermind
          </ButtonStyled>
        </div>
      }
    >
      <div>
        <p>You must be logged into your accout to start a group order.</p>
        <p>
          <ButtonStyled
            icon={iconMap.User}
            onClick={() => login('login')}
            color="cart"
          >
            Click here to login
          </ButtonStyled>
        </p>
      </div>
      <div style={{ margin: '3rem 0 0' }}>
        <p>
          Don't have an account?{' '}
          <ButtonLink icon={iconMap.User} onClick={() => login('signUp')}>
            Click here to create one.
          </ButtonLink>
        </p>
      </div>
    </ModalContent>
  )
}

GroupOrderGuest.displayName = 'GroupOrderGuest'

export default GroupOrderGuest
