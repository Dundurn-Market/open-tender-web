import React, { useEffect, useLayoutEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
  Content,
  HeaderDefault,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageError,
  PageTitle,
  Row
} from '../../index'
import {
  fetchCustomerOrders,
  fetchCustomerRecurrences, fetchGlobalMenuItems, fetchLocations, selectCustomer, selectCustomerOrders,
  selectCustomerRecurrences,
  selectCustomerRecurrencesLoadingStatus, selectGlobalMenuItems, selectRevenueCenters, selectTimezone, showNotification
} from '@open-tender/redux'
import { useDispatch, useSelector } from 'react-redux'
import { BgImage, ButtonLink, ButtonStyled } from '@open-tender/components'
import styled from '@emotion/styled'
import { openModal} from '../../../slices'
import { isoToDateStr } from '@open-tender/js'
import { parseISO } from 'date-fns'
import { getLongName } from '../../../utils'
import RecurringOrderGroup from './RecurringOrderGroup'
import { useNavigate } from 'react-router-dom'

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
  const recurrences = useSelector(selectCustomerRecurrences)
  const loading = useSelector(selectCustomerRecurrencesLoadingStatus)
  const isLoading = loading === 'pending'
  const { entities: menuItems } = useSelector(selectGlobalMenuItems)
  const customerOrders = useSelector(selectCustomerOrders)
  const { auth } = useSelector(selectCustomer)
  const { revenueCenters } = useSelector(selectRevenueCenters)

  const menuItemsMap = new Map(menuItems.map(item => [item.id, item]))

  const cancelRecurrence = (recurrence) => () => {
    dispatch(openModal({ type: 'deleteRecurrence', args: { recurrence } }))
  }

  useEffect(() => {
    if (!auth) return navigate('/guest')
  }, [auth, navigate])

  useLayoutEffect(() => {
    if (!recurrences.length) {
      dispatch(fetchCustomerRecurrences())
    }
    if (!revenueCenters.length) {
      dispatch(fetchLocations({type: 'OLO'}))
    }
    if (!customerOrders.length) {
      dispatch(fetchCustomerOrders())
    }
    if (menuItems.length === 0) {
      dispatch(fetchGlobalMenuItems())
    }
  }, [dispatch])

  const orderGroups = []
  const unconnectedRecurrences = []
  if (recurrences) {
    for (const recurrence of recurrences) {
      const item = menuItemsMap.get(recurrence.item_id)
      if (item) {
        let modifiers = null
        if (recurrence.groups && recurrence.groups.length) {
          modifiers = []
          for (let group of recurrence.groups) {
            const modifierGroup = item.option_groups.find(g => g.id === group.id)
            const options = []
            for (let opt of group.options) {
              let optName = modifierGroup.option_items.find(i => i.id === opt.id).short_name
              if (optName) {
                options.push(optName)
              }
            }

            if (group && options.length) {
              modifiers.push({name: modifierGroup.name, opts: options})
            }
          }

          if (!modifiers.length) modifiers = null
        }

        const orderGroup = orderGroups.find(g => g.order.order_id === recurrence.next_order_id)
        if (orderGroup) {
          const isSkipped = !orderGroup.order.cart.find(i => i.id === recurrence.item_id)
          orderGroup.recurrences.push({ ...recurrence, item, isSkipped, modifiers })
        } else {
          const order = customerOrders.entities.find(order => order.order_id === recurrence.next_order_id)
          if (order) {
            const revenueCenter = revenueCenters.find(rc => rc.revenue_center_id === order.revenue_center.revenue_center_id)
            const isSkipped = !order.cart.find(i => i.id === recurrence.item_id)
            orderGroups.push({ order, revenueCenter, recurrences: [{ ...recurrence, item, isSkipped, modifiers }] })
          } else {
            unconnectedRecurrences.push({ ...recurrence, item })
          }
        }
      } else {
        dispatch(showNotification(`Error! Menu item not found for recurrence! id:${recurrence.id}`))
      }
    }

    orderGroups.sort((a, b) => {
      const date1 = parseISO(a.order.requested_at)
      const date2 = parseISO(b.order.requested_at)
      return (date1 > date2) - (date1 < date2)
    })
  }

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
            <PageTitle title='Subscriptions' subtitle='Manage your subscriptions here' />
            {/*<PageError error={error} />*/}
            {recurrences && recurrences.length !== 0 ? (
              <div>
                {orderGroups.map((group) => (
                  <RecurringOrderGroup key={group.order.order_id} order={group.order} recurrences={group.recurrences} revenueCenter={group.revenueCenter} />
                ))}
                {unconnectedRecurrences.length !== 0 && (
                  <>
                    <div style={{borderBottom: '1px solid', margin: '2rem 0'}}>
                      <h6>Recurrences With No Existing Order</h6>
                    </div>
                    { unconnectedRecurrences.map((recurrence) => (
                      <Row
                        key={recurrence.id}
                        icon={<RecurringItemImage as='span'
                                                  style={{ backgroundImage: `url('${recurrence.item.small_image_url}')` }} />}
                        content={
                          <>
                            <p className='title'>{recurrence.item.name}{recurrence.isSkipped && <> - <b>SKIPPED</b></>}</p>
                            <p>Created on: {recurrence.created_at}</p>
                            <p>Re-occurs: {getLongName(recurrence.frequency)} on {isoToDateStr(recurrence.renewed_at, 'America/New_York', 'EEEE')}s</p>
                          </>
                        }
                        actions={
                            <ButtonStyled onClick={cancelRecurrence(recurrence)}
                              size='small' color='cart'
                            >
                              Delete Subscription
                            </ButtonStyled>
                        }
                      />
                    ))}
                  </>
                )}
              </div>
            ) : (
              <PageContent>
                {isLoading ? (
                  <Loading text='Retrieving your recurring items...' />
                ) : (
                  <p>Looks like you haven't added any recurring items. Re-occuring items can only be added as part
                    of <b>scheduled</b> delivery/pickup orders</p>
                )}
              </PageContent>
            )}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

export default Recurrences