import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'

import {
  fetchCustomerOrders,
  fetchCustomerRecurrences,
  fetchGlobalMenuItems,
  fetchLocations,
  selectCustomer,
  selectCustomerOrders,
  selectCustomerRecurrences,
  selectGlobalMenuItems,
  selectRevenueCenters,
} from '@open-tender/redux'
import { BgImage } from '@open-tender/components'
import { isDateOld } from '@open-tender/js'

import {
  Content,
  HeaderDefault,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageTitle,
} from '../../index'

import SubscriptionOrderGroup from './SubscriptionOrderGroup'
import useRecurrences from '../../../hooks/useRecurrences'

export const RecurringItemImage = styled(BgImage)`
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  width: 7.5rem;
  height: 7.5rem;
  overflow: hidden;
  border-radius: ${(props) => props.theme.border.radiusSmall};
  background-color: ${(props) => props.theme.bgColors.tertiary};
  display: flex;
`

const Recurrences = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { entities: menuItems } = useSelector(selectGlobalMenuItems)
  const customerOrders = useSelector(selectCustomerOrders)
  const { auth } = useSelector(selectCustomer)
  const {
    revenueCenters,
    last_updated: revenueCentersLastUpdated,
  } = useSelector(selectRevenueCenters)
  const {
    entities: recurrences,
    loading,
    last_updated,
  } = useSelector(selectCustomerRecurrences)
  const { getSubscriptionOrders } = useRecurrences()

  const [subscriptionGroups, setSubscriptions] = useState([])

  useEffect(() => {
    if (!auth) return navigate('/guest')
    if (!recurrences.length || !last_updated || isDateOld(last_updated)) {
      dispatch(fetchCustomerRecurrences())
    }
    if (
      !revenueCenters.length ||
      !revenueCentersLastUpdated ||
      isDateOld(revenueCentersLastUpdated)
    ) {
      dispatch(fetchLocations({type: 'OLO'}))
    }
    if (!customerOrders.length) {
      dispatch(fetchCustomerOrders())
    }
    if (menuItems.length === 0) {
      dispatch(fetchGlobalMenuItems())
    }
  }, [])

  useEffect(() => {
    setSubscriptions(getSubscriptionOrders())
  }, [getSubscriptionOrders])

  const isLoading = loading === 'pending'

  return (
    <>
      <Helmet>
        <title>
          Subscriptions
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />

        <Main>
          <PageContainer style={{ maxWidth: '90rem' }}>
            <PageTitle
              title='Subscriptions'
              subtitle='Manage your subscriptions here.'
            />
            {/*<PageError error={error} />*/}
            { !!subscriptionGroups.length
              ? <div>
                { subscriptionGroups.map((group) => (
                  <SubscriptionOrderGroup
                    key={group.key}
                    subscriptionGroup={group}
                  />
                ))}
              </div>
              : <PageContent>
                { isLoading
                  ? <Loading text='Retrieving your recurring items...' />
                  : <p>
                    Looks like you haven't added any recurring items.
                    Re-occuring items can only be added as part
                    of <b>scheduled</b> delivery/pickup orders
                  </p>
                }
              </PageContent>
            }
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

export default Recurrences
