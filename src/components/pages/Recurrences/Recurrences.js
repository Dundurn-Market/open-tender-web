import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
  Content,
  HeaderDefault, LinkSeparator,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageError,
  PageTitle,
  Row
} from '../../index'
import {
  editOrder, removeRecurrence, selectCustomerOrders,
  selectCustomerRecurrences,
  selectCustomerRecurrencesLoadingStatus, selectGlobalMenuItems, selectTimezone, showNotification
} from '@open-tender/redux'
import { useDispatch, useSelector } from 'react-redux'
import { BgImage, ButtonLink, ButtonStyled } from '@open-tender/components'
import styled from '@emotion/styled'
import { openModal, selectConfig } from '../../../slices'
import * as PropTypes from 'prop-types'
import { capitalize, isoToDateStr } from '@open-tender/js'
import { parseISO } from 'date-fns'
import { getLongName } from '../../../utils'
import RecurringOrderGroup from './RecurringOrderGroup'

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
  const recurrences = useSelector(selectCustomerRecurrences)
  const loading = useSelector(selectCustomerRecurrencesLoadingStatus)
  const isLoading = loading === 'pending'
  const { entities: menuItems } = useSelector(selectGlobalMenuItems)
  const customerOrders = useSelector(selectCustomerOrders)

  const menuItemsMap = new Map(menuItems.map(item => [item.id, item]))

  const cancelRecurrence = (recurrence) => () => {
    dispatch(openModal({ type: 'deleteRecurrence', args: { recurrence } }))
  }

  const orderGroups = []
  const unconnectedRecurrences = []
  if (recurrences) {
    for (const recurrence of recurrences) {
      const item = menuItemsMap.get(recurrence.item_id)
      if (item) {
        const orderGroup = orderGroups.find(g => g.order.order_id === recurrence.next_order_id)
        if (orderGroup) {
          const isSkipped = !orderGroup.order.cart.find(i => i.id === recurrence.item_id)
          orderGroup.recurrences.push({ ...recurrence, item, isSkipped })
        } else {
          const order = customerOrders.entities.find(order => order.order_id === recurrence.next_order_id)
          if (order) {
            const isSkipped = !order.cart.find(i => i.id === recurrence.item_id)
            orderGroups.push({ order, recurrences: [{ ...recurrence, item, isSkipped }] })
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
          Recurring Items
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer style={{ maxWidth: '86.8rem' }}>
            <PageTitle title='Recurring Items' subtitle='Manage your recurring subscriptions here' />
            {/*<PageError error={error} />*/}
            {recurrences && recurrences.length !== 0 ? (
              <div>
                {orderGroups.map((group) => (
                  <RecurringOrderGroup key={group.order.order_id} order={group.order} recurrences={group.recurrences} />
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