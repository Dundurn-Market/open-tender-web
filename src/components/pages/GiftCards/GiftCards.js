import React, { useCallback, useContext, useEffect } from 'react'
import { isBrowser } from 'react-device-detect'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Minus, Plus } from 'react-feather'
import { Link } from 'react-router-dom'
import { GiftCardsForm } from '@open-tender/components'
import {
  selectGiftCards,
  resetGiftCards,
  purchaseGiftCards,
  selectCustomer,
  fetchCustomerCreditCards,
  selectCustomerCreditCardsForPayment,
  setAlert,
} from '@open-tender/redux'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Content,
  FormWrapper,
  Main,
  PageTitle,
  PageContent,
  HeaderDefault,
  PageContainer,
} from '../..'

const iconMap = {
  plus: <Plus size={null} />,
  minus: <Minus size={null} />,
}

const GiftCards = () => {
  const dispatch = useDispatch()
  const { giftCards: config } = useSelector(selectConfig)
  const { title } = useSelector(selectBrand)
  const { profile: customer } = useSelector(selectCustomer) || {}
  const creditCards = useSelector(selectCustomerCreditCardsForPayment)
  const { success, loading, error, giftCards } = useSelector(selectGiftCards)
  const purchase = useCallback(
    (data, callback) => dispatch(purchaseGiftCards(data, callback)),
    [dispatch]
  )
  const reset = useCallback(() => dispatch(resetGiftCards()), [dispatch])
  const showAlert = useCallback((obj) => dispatch(setAlert(obj)), [dispatch])
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    dispatch(fetchCustomerCreditCards())
  }, [dispatch, customer])

  useEffect(() => {
    return () => dispatch(resetGiftCards())
  }, [dispatch])

  return (
    <>
      <Helmet>
        <title>
          {config.title} | {title}
        </title>
      </Helmet>
      <Content>
        <HeaderDefault title={isBrowser ? null : config.title} />
        <Main>
          <PageContainer style={{ maxWidth: '76.8rem' }}>
            <PageTitle {...config} />
            <FormWrapper>
              <GiftCardsForm
                customer={customer}
                creditCards={creditCards}
                purchase={purchase}
                setAlert={showAlert}
                reset={reset}
                success={success}
                purchasedCards={giftCards}
                loading={loading}
                error={error}
                iconMap={iconMap}
                windowRef={windowRef}
              />
            </FormWrapper>
            {success && (
              <PageContent>
                <p>
                  {customer ? (
                    <Link to="/">Head back to your account page</Link>
                  ) : (
                    <Link to="/">
                      Head back to the home page to start an order
                    </Link>
                  )}
                </p>
              </PageContent>
            )}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

GiftCards.displayName = 'GiftCards'
export default GiftCards
