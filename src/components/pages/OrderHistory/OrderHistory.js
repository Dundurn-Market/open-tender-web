import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import {
  fetchCustomerOrders,
  fetchLocations,
  selectCustomer,
  selectCustomerOrders,
} from '@open-tender/redux'
import { ButtonLink, ButtonStyled } from '@open-tender/components'
import { isoToDate } from '@open-tender/js'

import { selectBrand, selectConfig } from '../../../slices'
import {
  Content,
  HeaderDefault,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageError,
  PageTitle,
} from '../..'
import OrdersList from './OrdersList'

const Orders = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const increment = 20
  const limit = 60
  const [count, setCount] = useState(increment)
  const orders = useSelector(selectCustomerOrders)
  const { entities, loading, error } = orders
  const [recentOrders, setRecentOrders] = useState(entities.slice(0, count))
  const { title: siteTitle } = useSelector(selectBrand)
  const { orders: config } = useSelector(selectConfig)
  const { auth } = useSelector(selectCustomer)
  const isLoading = loading === 'pending'

  useEffect(() => {
    if (!auth) return navigate('/account')
  }, [auth, navigate])

  useEffect(() => {
    dispatch(fetchCustomerOrders(limit + 1))
    dispatch(fetchLocations({type: 'OLO'}))
  }, [dispatch])

  useEffect(() => {
    setRecentOrders(entities.slice(0, count))
  }, [entities, count])

  const loadMore = () => {
    setCount(Math.min(count + increment, limit))
  }

  const goToSubscriptions = () => {
    navigate(`/subscriptions`)
  }

  if (!auth) return null

  const now = new Date()
  const upcoming = recentOrders.filter(i => isoToDate(i.requested_at) >= now)
  const past = recentOrders.filter(i => isoToDate(i.requested_at) < now)

  upcoming.sort((a, b) => a.requested_at > b.requested_at ? 1 : -1)

  return (
    <>
      <Helmet>
        <title>
          {config.title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer style={{ maxWidth: '114rem' }}>
            <PageTitle
              {...config}
              subtitle={
                <>
                  <p>{ config.subtitle }</p>
                  <p style={{ marginTop : '1rem' }}>
                    <span>Looking for your subscription items? </span>
                    <ButtonLink onClick={goToSubscriptions}>
                      Click here to see your subscriptions.
                    </ButtonLink>
                  </p>
                </>
              }
            />
            <PageError error={error} />
            { !isLoading
              ? <>
                { upcoming.length
                  ? <>
                    <OrdersList orders={upcoming} delay={0} />
                    {!past.length && (entities.length - 1 > count) &&
                      <ButtonStyled onClick={loadMore}>
                        Load more orders
                      </ButtonStyled>
                    }
                  </>
                  : <PageContent>
                    <p>Looks like you don't have any upcoming orders.</p>
                  </PageContent>
                }
                <PageTitle
                  title='Order History'
                  subtitle={'Reorder past orders, ' +
                    'or add order ratings & comments.'}
                  style={{ marginTop : '8rem' }}
                />
                { past.length
                  ? <>
                    <OrdersList orders={past} delay={0} />
                    {entities.length - 1 > count &&
                      <ButtonStyled onClick={loadMore}>
                        Load more recent orders
                      </ButtonStyled>
                    }
                  </>
                  : <PageContent>
                    <p>Looks like you don't have any past orders.</p>
                  </PageContent>
                }
              </>
              : <PageContent>
                <Loading text="Retrieving your orders. Please sit tight." />
              </PageContent>
            }
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

Orders.displayName = 'Orders'
export default Orders
