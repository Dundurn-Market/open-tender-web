import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import {
  selectCustomerOrders,
  selectCustomerRecurrences,
  selectGlobalMenuItems ,
} from '@open-tender/redux'

import { parseDate } from '../utils/date'

const isOrderRecurrence = (recurrence, order) => {
  if (recurrence.next_order_id === order.order_id) return true
  if (
    recurrence.revenue_center_id === order.revenue_center.revenue_center_id &&
    recurrence.service_type === order.service_type &&
    (
      (!recurrence.address && !order.address) ||
      recurrence.address?.customer_address_id ===
        recurrence.address?.customer_address_id
    ) &&
    parseDate(recurrence.renewed_at).getTime() ===
      parseDate(order.requested_at).getTime()
  ) return true
  return false
}

const findOrderRecurrences = (order, recurrences) => {
  return recurrences.reduce(
    (aggregate, recurrence) => {
      if (isOrderRecurrence(recurrence, order)) aggregate.push(recurrence)
      return aggregate
    },
    [],
  )
}

const findMatchingRecurrence = (item, recurences) => {
  let i = 0
  for (const recurrence of recurences) {
    // TODO: check modifiers
    if (
      recurrence.item_id === item.id &&
      recurrence.quantity === item.quantity
    ) return [recurrence, i]
    i += 1
  }
  return [null, null]
}

const useRecurrences = () => {
  const { entities: menuItems } = useSelector(selectGlobalMenuItems)
  const { entities: customerOrders } = useSelector(selectCustomerOrders)
  const { entities: recurrences } = useSelector(selectCustomerRecurrences)

  const generateSubscription = useCallback((item, recurrence) => {
    let menuItem = recurrence
      ? menuItems.find(i => i.id === recurrence.item_id)
      : menuItems.find(i => i.id === item.id)

    return {
      item,
      menuItem,
      recurrence,
      name : item ? item.name : menuItem?.name,
      img : item
        ? item.images.find(i => i.type === 'APP_IMAGE')?.url
        : menuItem.small_image_url,
      groups : item ? item.groups : recurrence.groups,
      quantity : item ? item.quantity : recurrence.quantity,
      frequency : recurrence ? recurrence.frequency : 'SINGLE',
      created_at : recurrence?.created_at,
      renewed_at : recurrence?.renewed_at,
      exists : !!item,
    }
  }, [menuItems])

  const generateSubscriptions = useCallback(() => {
    const starting = (new Date()).setHours(0)
    const sortedOrders = customerOrders.filter(
      order => parseDate(order.requested_at) > starting,
    ).sort(
      (a, b) => parseDate(a.requested_at).getTime() -
        parseDate(b.requested_at).getTime(),
    )

    const allRecurrences = recurrences.filter(
      r => parseDate(r.renewed_at) > starting,
    )

    const assignedReccurences = []
    const subscriptionOrders = sortedOrders.map((order) => {
      const unclaimedRecurrences = allRecurrences.filter(
        (r) => !sortedOrders.some((i) => i.order_id === r.next_order_id)
      )
      const orderRecurrences = findOrderRecurrences(order, unclaimedRecurrences)
      orderRecurrences.push(
        ...allRecurrences.filter((r) => r.next_order_id === order.order_id)
      )

      assignedReccurences.push(...orderRecurrences)

      const subscriptions = order.cart.map((item) => {
        const [_, i] = findMatchingRecurrence(item, orderRecurrences)
        const recurrence = i !== null
          ? orderRecurrences.splice(i, 1)[0]
          : null

        return generateSubscription(item, recurrence)
      })
      orderRecurrences.forEach((recurrence) => {
        subscriptions.push(generateSubscription(null, recurrence))
      })

      return {
        key : order.order_id,
        order,
        revenue_center_id : order.revenue_center.revenue_center_id,
        service_type : order.service_type,
        address : order.address,
        requested_at : order.requested_at,
        subscriptions,
      }
    })

    const orphanedRecurrences = allRecurrences.filter(
      r => assignedReccurences.indexOf(r) === -1
    )
    const phantomOrders = orphanedRecurrences.reduce(
      (aggregate, recurrence) => {
        // TODO: combine with isOrderRecurrence
        const matchingOrder = aggregate.find(a => (
          a.revenue_center_id === recurrence.revenue_center_id &&
          a.service_type === recurrence.service_type &&
          (
            (!a.address && !recurrence.address) ||
            a.address?.customer_address_id ===
              recurrence.address?.customer_address_id
          ) &&
          parseDate(a.requested_at).getTime() ===
            parseDate(recurrence.renewed_at).getTime()
        ))

        if (!!matchingOrder) {
          matchingOrder.subscriptions.push(
            generateSubscription(null, recurrence),
          )
        } else {
          aggregate.push({
            revenue_center_id : recurrence.revenue_center_id,
            service_type : recurrence.service_type,
            address : recurrence.address,
            requested_at : recurrence.renewed_at,
            subscriptions : [generateSubscription(null, recurrence)]
          })
        }
        return aggregate
      },
      [],
    )

    subscriptionOrders.push(...phantomOrders.map((order) => ({
      key : `${order.revenue_center_id}-` +
        `${order.service_type}-` +
        `${order.requested_at}` +
        (order.address
          ? `-${order.address.customer_address_id}`
          : ''
        ),
      order : null,
      revenue_center_id : order.revenue_center_id,
      service_type : order.service_type,
      address : order.address,
      requested_at : order.requested_at,
      subscriptions : order.subscriptions,
    })))
    return subscriptionOrders
  }, [customerOrders, recurrences, findOrderRecurrences, generateSubscription])

  return {
    getSubscriptionOrders : generateSubscriptions,
  }
}

export default useRecurrences
