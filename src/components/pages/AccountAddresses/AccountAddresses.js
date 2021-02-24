import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import {
  selectCustomer,
  fetchCustomerAddresses,
  selectCustomerAddresses,
} from '@open-tender/redux'
import { Helmet } from 'react-helmet'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig } from '../../../slices'
import Addresses from './Addresses'
import {
  Background,
  Container,
  Content,
  HeaderUser,
  Loading,
  Main,
  PageContent,
  PageTitle,
} from '../..'
import { AppContext } from '../../../App'
import AccountTabs from '../Account/AccountTabs'

const AccountAddresses = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { title: siteTitle } = useSelector(selectBrand)
  const config = useSelector(selectConfig)
  const { auth } = useSelector(selectCustomer)
  const { entities, loading } = useSelector(selectCustomerAddresses)
  const isLoading = loading === 'pending'
  const limit = 50
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    dispatch(fetchCustomerAddresses(limit))
  }, [dispatch])

  return auth ? (
    <>
      <Helmet>
        <title>
          {config.addresses.title} | {siteTitle}
        </title>
      </Helmet>
      <Background imageUrl={config.account.background} />
      <Content maxWidth="76.8rem">
        <HeaderUser
          title={isBrowser ? null : config.account.addresses.title}
          maxWidth="76.8rem"
          bgColor="secondary"
          borderColor="secondary"
        />
        <Main bgColor="secondary">
          {!isBrowser && <AccountTabs />}
          <Container>
            <PageTitle {...config.addresses} />
            <PageContent>
              {entities.length ? (
                <Addresses addresses={entities} isLoading={isLoading} />
              ) : isLoading ? (
                <Loading text="Retrieving your order history..." />
              ) : (
                <p>
                  Looks like you haven't added any addresses yet. Please place
                  an order to add one.
                </p>
              )}
            </PageContent>
          </Container>
        </Main>
      </Content>
    </>
  ) : null
}

AccountAddresses.displayName = 'AccountAddresses'
export default AccountAddresses
