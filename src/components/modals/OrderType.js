import React from 'react'
import propTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { resetOrderType, selectOrder } from '@open-tender/redux'
import { serviceTypeNamesMap } from '@open-tender/js'
import { ButtonStyled } from '@open-tender/components'

import { closeModal } from '../../slices'
import { ModalContent, ModalView } from '..'

const OrderType = ({ startOver }) => {
  const dispatch = useDispatch()
  const { serviceType } = useSelector(selectOrder)
  const serviceTypeName = serviceTypeNamesMap[serviceType]

  const changeOrderType = () => {
    dispatch(resetOrderType())
    dispatch(closeModal())
    startOver()
  }

  const cancel = () => {
    dispatch(closeModal())
  }

  return (
    <ModalView>
      <ModalContent
        title="Change your order type"
        footer={
          <div>
            <ButtonStyled onClick={cancel} color="cart">
              Keep {serviceTypeName}
            </ButtonStyled>
            <ButtonStyled onClick={changeOrderType}>
              Change Order Type
            </ButtonStyled>
          </div>
        }
      >
        <div>
          <p>Are you sure you want to change your order type?</p>
          <p>
            This will start you over at the beginning, but the items in your
            cart will not be affected.
          </p>
        </div>
      </ModalContent>
    </ModalView>
  )
}

OrderType.displayName = 'OrderType'
OrderType.prototypes = {
  startOver: propTypes.func,
}

export default OrderType
