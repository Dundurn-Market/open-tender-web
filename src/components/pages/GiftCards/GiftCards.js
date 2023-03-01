import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { ButtonLink, FormWrapper } from '@open-tender/components'
import {
  selectGiftCards,
  resetGiftCards,
  purchaseGiftCards,
  selectCustomer,
  fetchCustomerCreditCards,
  selectCustomerCreditCardsForPayment,
  setAlert,
} from '@open-tender/redux'
import {
  openModal,
  selectBrand,
  selectConfig,
  selectRecaptcha,
} from '../../../slices'
import { Minus, Plus } from '../../icons'
import {
  Content,
  Main,
  PageTitle,
  PageContent,
  HeaderDefault,
  PageContainer,
} from '../..'
import GiftCardsForm from '../../forms/GiftCardForm';

const giftCardIconMap = {
  plus: <Plus strokeWidth={2} />,
  minus: <Minus strokeWidth={2} />,
}

const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY

const GiftCards = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { giftCards: config } = useSelector(selectConfig)
  const { giftCards: includeRecaptcha } = useSelector(selectRecaptcha)
  const { title, has_gift_cards } = useSelector(selectBrand)
  const { profile: customer } = useSelector(selectCustomer) || {}
  const creditCards = useSelector(selectCustomerCreditCardsForPayment)
  const { success, loading, error, giftCards } = useSelector(selectGiftCards)
  const purchase = useCallback(
    (data, callback) => dispatch(purchaseGiftCards(data, callback)),
    [dispatch]
  )
  const reset = useCallback(() => dispatch(resetGiftCards()), [dispatch])
  const showAlert = useCallback((obj) => dispatch(setAlert(obj)), [dispatch])

  useEffect(() => {
    if (!has_gift_cards) return navigate('/account')
  }, [has_gift_cards, navigate])

  useEffect(() => {
    dispatch(fetchCustomerCreditCards())
  }, [dispatch, customer])

  useEffect(() => {
    return () => dispatch(resetGiftCards())
  }, [dispatch])

  const login = () => {
    dispatch(openModal({ type: 'login' }))
  }

  const goToPaymentMethods = () => {
    navigate('/account/credit-cards')
  }

  const registed = !!customer
  const hasCreditCard = !!creditCards?.length
  const canPurchase = registed && hasCreditCard

  return (
    <>
      <Helmet>
        <title>
          {config.title} | {title}
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer style={{ maxWidth: '76.8rem' }}>
            <PageTitle
              {...config}
              {...(!hasCreditCard && {
                subtitle : <>
                  <p>
                    <span>Please </span>
                    <ButtonLink onClick={goToPaymentMethods}>
                      add a credit card
                    </ButtonLink>
                    <span> to purchase online gift cards.</span>
                  </p>
                  <p>
                    Currently,
                    gift cards purchased here are only applicable online.
                  </p>
                </>
              })}
              {...(!registed && {
                subtitle : <>
                  <p>
                    <span>Please </span>
                    <ButtonLink onClick={login}>sign-in</ButtonLink>
                    <span> to purchase online gift cards.</span>
                  </p>
                  <p>
                    Currently,
                    gift cards purchased here are only applicable online.
                  </p>
                </>
              })}
            />
            <FormWrapper>
              { canPurchase &&
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
                  iconMap={giftCardIconMap}
                  recaptchaKey={includeRecaptcha ? recaptchaKey : null}
                />
              }
            </FormWrapper>
            {success && (
              <PageContent>
                <p>
                  {customer ? (
                    <Link to="/account">Head back to your account page</Link>
                  ) : (
                    <Link to="/account">
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
