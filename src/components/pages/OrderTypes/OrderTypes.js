import React, { useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import styled from '@emotion/styled'
import {
  selectCustomer,
  resetRevenueCenters,
  resetOrderType,
  selectGroupOrder,
  resetGroupOrder,
} from '@open-tender/redux'
import { useGeolocation } from '@open-tender/components'

import { maybeRefreshVersion } from '../../../app/version'
import {
  selectConfig,
  setGeoLatLng,
  setGeoError,
  setGeoLoading,
  selectSettings,
  closeModal,
} from '../../../slices'
import {
  Background,
  Content,
  HeaderLogo,
  HeaderMobile,
  Main,
  Welcome,
  WelcomeHeader,
} from '../..'
import { Account, StartOver } from '../../buttons'
import OrderTypeButtons from './OrderTypeButtons'
import { AppContext } from '../../../App'

const HomeHeader = styled('div')`
  padding: 2.5rem;
`

const HomeContent = styled('div')`
  padding: 0 2.5rem 2.5rem;
  line-height: ${(props) => props.theme.lineHeight};
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: 2.5rem;
    color: ${(props) => props.theme.colors.light};
    background-color: rgba(0, 0, 0, 0.3);
    border-top: 0.1rem solid rgba(255, 255, 255, 0.3);
  }

  p {
    margin: 0.5em 0;

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`

const makeContent = (content) => {
  if (!content || !content.length || !content[0].length) return null
  return (
    <HomeContent>
      {content.map((i, index) => (
        <p key={index}>{i}</p>
      ))}
    </HomeContent>
  )
}

const OrderTypes = () => {
  const dispatch = useDispatch()
  const { geoLatLng, geoError } = useGeolocation()
  const { auth } = useSelector(selectCustomer)
  const { home: homeConfig } = useSelector(selectConfig)
  const { background, mobile, title, subtitle, content } = homeConfig
  const { orderTypes } = useSelector(selectSettings)
  const hasOrderTypes = orderTypes && orderTypes.length > 0
  const { cartGuest } = useSelector(selectGroupOrder)
  const { cartGuestId } = cartGuest || {}
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
    dispatch(setGeoLoading())
    dispatch(resetRevenueCenters())
    dispatch(resetOrderType())
    dispatch(closeModal())
  }, [windowRef, dispatch])

  useEffect(() => {
    if (cartGuestId) dispatch(resetGroupOrder())
  }, [dispatch, cartGuestId])

  useEffect(() => {
    if (geoLatLng) {
      dispatch(setGeoLatLng(geoLatLng))
    } else if (geoError) {
      dispatch(setGeoError(geoError))
    }
  }, [geoLatLng, geoError, dispatch])

  return (
    <>
      {auth && <Background imageUrl={background} />}
      <Content maxWidth="76.8rem">
        <HeaderMobile
          bgColor={isBrowser ? 'primary' : 'transparent'}
          borderColor={isBrowser ? 'primary' : 'transparent'}
          maxWidth="76.8rem"
          left={auth ? <StartOver /> : <HeaderLogo />}
          right={<Account color="light" />}
        />
        <Main padding="0" imageUrl={mobile || background}>
          {hasOrderTypes ? (
            <Welcome
              footer={<OrderTypeButtons content={makeContent(content)} />}
            >
              <HomeHeader>
                <WelcomeHeader title={title} subtitle={subtitle} />
              </HomeHeader>
            </Welcome>
          ) : (
            <Welcome>
              <HomeHeader>
                <WelcomeHeader
                  title="Online ordering is currently closed"
                  subtitle="We're very sorry for the inconvenience. Please try back at a
                    later time."
                />
              </HomeHeader>
            </Welcome>
          )}
        </Main>
      </Content>
    </>
  )
}

OrderTypes.displayName = 'OrderTypes'
export default OrderTypes