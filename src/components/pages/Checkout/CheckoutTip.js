import React, { useState, useEffect } from 'react'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'
import ReactTooltip from 'react-tooltip'
import {
  selectCheckout,
  selectOrder,
  updateForm,
  validateOrder
} from '@open-tender/redux'
import { formatDollars, formatQuantity } from '@open-tender/js'
import {
  ButtonLink,
  ButtonStyled,
  Checkmark,
  Input,
  Text,
} from '@open-tender/components'

import CheckoutSection from './CheckoutSection'
import CheckoutTipButton from './CheckoutTipButton'

const CheckoutTipView = styled.div`
  margin: 1.5rem 0 0;
`

const CheckoutTipOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 -0.5rem;
`

const CheckoutTipCustom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0 0;
`

const CheckoutTipCustomInput = styled.div`
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0 2rem 0 0;
`
const CheckoutTipCustomCheckmark = styled.div`
  position: absolute;
  top: 0;
  right: 2rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CheckoutTipCustomButton = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
`

const percentages = [10.0, 15.0, 18.0, 20.0]

const makeTipOptions = (options) => {
  return options.filter((i) => percentages.includes(parseFloat(i.percent)))
}

const CheckoutTip = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { check, form, loading } = useSelector(selectCheckout)
  const { revenueCenter, serviceType } = useSelector(selectOrder)

  const isQuickDelivery = revenueCenter.delivery_zone.priority !== 1 &&
    serviceType === 'DELIVERY'
  const showTip = isQuickDelivery

  const tipSettings = check.config.gratuity
  const { has_tip, options } = tipSettings
  const tipOptions = makeTipOptions(options)
  const initialTip =
    form.tip && !tipOptions.find((i) => i.amount === form.tip) ? form.tip : null
  const [customTip, setCustomTip] = useState(initialTip)
  const [deliberateTip, setDeliberateTip] = useState(false)
  const customTipApplied = customTip && customTip === check.totals.tip

  useEffect(() => {
    if (has_tip && !form.tip && loading !== 'pending') {
      setCustomTip('')
      dispatch(updateForm({ tip: check.totals.tip }))
    }
  }, [has_tip, form.tip, loading, check.totals.tip, dispatch])

  useEffect(() => {
    if (isQuickDelivery) return
    setCustomTip('0.00')
    dispatch(updateForm({ tip: '0.00' }))
    dispatch(validateOrder())
  }, [isQuickDelivery, setCustomTip, dispatch])

  if (!has_tip) return null

  const chooseTip = (amount) => {
    setCustomTip('')
    dispatch(updateForm({ tip: amount }))
    dispatch(validateOrder())
  }

  const handleCustomTip = (txt) => {
    setCustomTip(txt)
    setDeliberateTip(true)
  }

  const applyCustomTip = () => {
    const formatted = parseFloat(customTip).toFixed(2)
    setCustomTip(formatted)
    dispatch(updateForm({ tip: formatted }))
    dispatch(validateOrder())
  }

  return (
    <CheckoutSection title="Add a Tip">
      <CheckoutTipView>
        { showTip &&
          <CheckoutTipOptions>
            {tipOptions.map((i) => {
              const isApplied = !customTip && form.tip === i.amount
              return (
                <CheckoutTipButton
                  key={`${i.percent}-${i.amount}`}
                  title={`${formatQuantity(i.percent)}%`}
                  subtitle={formatDollars(i.amount)}
                  onPress={isApplied ? null : () => chooseTip(i.amount)}
                  isApplied={isApplied}
                  disabled={isApplied}
                />
              )
            })}
          </CheckoutTipOptions>
        }
        <CheckoutTipCustom>
          <CheckoutTipCustomInput>
            <Input
              label="Enter custom tip"
              name="custom_tip"
              type="number"
              value={customTip || ''}
              onChange={(evt) => handleCustomTip(evt.target.value)}
              style={{ margin: 0 }}
            />
            { customTipApplied && deliberateTip && (
              <CheckoutTipCustomCheckmark>
                <Checkmark />
              </CheckoutTipCustomCheckmark>
            )}
          </CheckoutTipCustomInput>
          <CheckoutTipCustomButton>
            <ButtonStyled
              onClick={applyCustomTip}
              disabled={!customTip || customTipApplied}
              size="small"
              color="secondary"
            >
              Apply
            </ButtonStyled>
          </CheckoutTipCustomButton>
        </CheckoutTipCustom>
      </CheckoutTipView>
      <p
        data-tip
        data-for="tipToolTip"
        style={{ width : !isMobileOnly ? 'fit-content' : undefined }}
      >
        <Text size='small'>
          <ButtonLink color='dark' onClick={() => {}}>
            Where does my tip go?
          </ButtonLink>
        </Text>
      </p>
      <ReactTooltip
        id='tipToolTip'
        place='bottom'
        effect='solid'
        backgroundColor={theme.bgColors.dark}
      >
        <div style={{ maxWidth : '200px', lineHeight : 1.25 }}>
          <Text size='small'>
            <span>The tip for your order will be split equally between the
            MRKTBOX location staff and the delivery driver. If your order is
            delivered by <i>Uber&nbsp;Eats</i>, <i>Doordash</i>, or
            other </span>
            <span style={{ whiteSpace: 'nowrap' }}> on-demand </span>
            <span> couriers, half of this tip will still be forwarded to the
            driver along with your order.</span>
          </Text>
        </div>
      </ReactTooltip>
    </CheckoutSection>
  )
}

CheckoutTip.displayName = 'CheckoutTip'

export default CheckoutTip
