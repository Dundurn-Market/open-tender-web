import { makeFirstRequestedAt } from '@open-tender/js'

export const isScheduled = (revenueCenter) => {
  if (
    revenueCenter.order_times?.DELIVERY ||
    revenueCenter.order_times?.PICKUP
  ) return true
  return false
}

export const isValidTime = (revenueCenter, requestedAt, serviceType) => {
  const validRequestedAt = makeFirstRequestedAt(
    revenueCenter,
    serviceType,
    requestedAt,
  )
  return validRequestedAt === requestedAt
}
