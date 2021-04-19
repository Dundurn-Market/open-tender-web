import React, { useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import {
  selectCustomer,
  selectCustomerHouseAccounts,
  fetchCustomerHouseAccounts,
} from '@open-tender/redux'
import { Helmet } from 'react-helmet'

import { maybeRefreshVersion } from '../../../app/version'
import { selectAccountConfig, selectBrand } from '../../../slices'
import {
  AccountBack,
  Content,
  HeaderUser,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageError,
  PageTitle,
} from '../..'
import { AppContext } from '../../../App'
import HouseAccountsList from './HouseAccountsList'
import AccountTabs from '../Account/AccountTabs'

const AccountHouseAccounts = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { title: siteTitle } = useSelector(selectBrand)
  const { auth } = useSelector(selectCustomer)
  const account = useSelector(selectAccountConfig)
  const { entities, loading, error } = useSelector(selectCustomerHouseAccounts)
  const isLoading = loading === 'pending'
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    dispatch(fetchCustomerHouseAccounts())
  }, [dispatch])

  return (
    <>
      <Helmet>
        <title>
          {account.houseAccounts.title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <HeaderUser title={isBrowser ? null : account.houseAccounts.title} />
        <Main>
          {!isBrowser && <AccountTabs />}
          <PageContainer style={{ maxWidth: '76.8rem' }}>
            <PageTitle {...account.houseAccounts} preface={<AccountBack />} />
            <PageError error={error} />
            {entities.length ? (
              <HouseAccountsList houseAccounts={entities} />
            ) : (
              <PageContent>
                {isLoading ? (
                  <Loading text="Retrieving your house accounts..." />
                ) : (
                  <p>{account.houseAccounts.empty}</p>
                )}
              </PageContent>
            )}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

AccountHouseAccounts.displayName = 'AccountHouseAccounts'
export default AccountHouseAccounts
