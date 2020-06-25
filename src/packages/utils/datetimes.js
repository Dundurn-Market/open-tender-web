import { parseISO, add } from 'date-fns'
import { format, toDate, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import { menuServiceTypeMap } from './constants'

/* CONSTANTS */

const DATE = 'yyyy-MM-dd'
const HUMAN_DATE = 'MMM d, yyyy'
const DATETIME = 'yyyy-MM-dd h:mma'
const TIME = 'h:mma'

export const timezoneMap = {
  'US/Eastern': 'America/New_York',
  'US/Central': 'America/Chicago',
  'US/Mountain': 'America/Denver',
  'US/Pacific': 'America/Los_Angeles',
}

export const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const weekdaysUpper = weekdays.map((weekday) => weekday.toUpperCase())
export const weekdaysLower = weekdays.map((weekday) => weekday.toLowerCase())

export const weekdayOptions = weekdays.map((weekday) => ({
  value: weekday.toUpperCase(),
  name: weekday,
}))

export const makeWeekday = (date = new Date()) => {
  return format(date, 'EEEE').toUpperCase()
}

export const dateForWeekday = (weekday) => {
  const currentWeekday = makeWeekday()
  const currentIndex = weekdaysUpper.findIndex((i) => i === currentWeekday)
  const index = weekdaysUpper.findIndex((i) => i === weekday.toUpperCase())
  const offset = index - currentIndex + (index >= currentIndex ? 0 : 7)
  return add(new Date(), { days: offset })
}

export const weekdayAndTimeToDate = (weekday, timeStr) => {
  const date = dateForWeekday(weekday)
  const [hours, minutes] = timeStr.split(':').map((i) => parseInt(i))
  return setTimeForDate(date, hours, minutes)
}

/* HELPERS */

// https://stackoverflow.com/questions/54555491/how-to-guess-users-timezone-using-date-fns-in-a-vuejs-app
export const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (err) {
    return 'America/New_York'
  }
}

export const makeLocalDate = (dateStr) => {
  const tz = getUserTimezone()
  return toDate(dateStr, { timezone: tz })
}

// returns a date string in a user's local time
export const makeLocalDateStr = (date, days = 0, fmt = DATE) => {
  return format(add(date || new Date(), { days: days }), fmt)
}

export const todayDate = () => makeLocalDateStr()
export const tomorrowDate = () => makeLocalDateStr(null, 1)

export const isoToDate = (iso, tz) => {
  return tz ? utcToZonedTime(parseISO(iso), tz) : parseISO(iso)
}

export const isoToDateStr = (iso, tz, fmt = DATETIME) => {
  return format(isoToDate(iso, tz), fmt)
}

export const dateToIso = (date, tz) => {
  return zonedTimeToUtc(date, tz).toISOString()
}

export const dateStrToDate = (str) => toDate(str)

export const formatDateStr = (str, fmt = HUMAN_DATE) => {
  return format(toDate(str), fmt)
}

export const formatTimeStr = (str) => {
  const clean = str.replace(/\s/g, '').toLowerCase()
  const parts = clean.split('-')
  if (parts.length === 1) return clean
  const [part1, part2] = parts
  const end1 = part1.substr(part1.length - 2)
  const end2 = part2.substr(part1.length - 2)
  const newPart1 =
    ['am', 'pm'].includes(end1) && end1 === end2
      ? part1.slice(0, part1.length - 2)
      : part1
  return [newPart1, part2].join('-')
}

export const makeReadableDateStrFromIso = (iso, tz, verbose = false) => {
  if (!iso || iso.toLowerCase() === 'asap') return 'ASAP'
  const date = utcToZonedTime(parseISO(iso), tz)
  const timeString = format(date, TIME).toLowerCase()
  const dateString = makeLocalDateStr(date)
  if (dateString === todayDate()) {
    return verbose ? `Today @ ${timeString}` : timeString
  } else if (dateString === tomorrowDate()) {
    return `${verbose ? 'Tomorrow' : 'Tmrw'} @ ${timeString}`
  } else {
    return `${
      verbose ? format(date, 'EEEE, MMMM d') : format(date, 'M/d')
    } @ ${timeString}`
  }
}

export const makeRequestedIso = (requestedAt) => {
  return !requestedAt || requestedAt === 'asap'
    ? new Date().toISOString()
    : requestedAt
}

export const makeRequestedAtStr = (requestedAt, tz, verbose = false) => {
  if (!requestedAt || requestedAt.toLowerCase() === 'asap') return 'ASAP'
  return makeReadableDateStrFromIso(requestedAt, tz, verbose)
}

export const makeEstimatedTime = (
  requestedAt,
  revenueCenter,
  serviceType,
  verbose = false
) => {
  if (
    requestedAt !== 'asap' ||
    !serviceType ||
    !revenueCenter ||
    !revenueCenter.settings
  )
    return null
  const { first_times } = revenueCenter.settings
  const menuServiceType = menuServiceTypeMap[serviceType]
  const firstTime = first_times[menuServiceType]
  if (firstTime.date === todayDate()) {
    return `around ${firstTime.time}`
  } else if (firstTime.date === tomorrowDate()) {
    return `tomorrow @ ${formatTimeStr(firstTime.time)}`
  } else {
    const tz = timezoneMap[revenueCenter.timezone]
    const date = toDate(firstTime.date, { timezone: tz })
    return `${verbose ? format(date, 'EEEE, MMMM d') : format(date, 'M/d')} @ ${
      firstTime.time
    }`
  }
}

function* range(start, end, step) {
  for (let i = start; i <= end; i += step) {
    yield i
  }
}

export const makeOppositeTimes = (times, interval, min = 0, max = 1440) => {
  return [...range(min, max - interval, interval)].filter(
    (i) => !times.includes(i)
  )
}

export const makeWeekdaysExcluded = (validTimes) => {
  return Object.entries(validTimes).reduce((obj, entry) => {
    const [weekday, dayparts] = entry
    const orderableDayparts = dayparts.filter((d) => d.is_orderable)
    if (!orderableDayparts.length) {
      obj[weekday.toUpperCase()] = null
      return obj
    }
    const interval = orderableDayparts[0].interval
    const orderableTimes = orderableDayparts.reduce((all, daypart) => {
      return all.concat(
        daypart.times.filter((i) => i.is_orderable).map((i) => i.minutes)
      )
    }, [])
    obj[weekday.toUpperCase()] = makeOppositeTimes(orderableTimes, interval)
    return obj
  }, {})
}

export const makeClosedWeekdays = (weekdayTimes) => {
  return Object.entries(weekdayTimes)
    .filter(([, times]) => !times)
    .map(([weekday]) => weekdaysUpper.indexOf(weekday))
}

export const time24ToMinutes = (str) => {
  const [hours, minutes] = str.split(':')
  return parseInt(hours) * 60 + parseInt(minutes)
}

export const setTimeForDate = (date, hours, minutes, seconds = 0) => {
  date.setHours(hours)
  date.setMinutes(minutes)
  date.setSeconds(seconds)
  date.setMilliseconds(0)
  return date
}

export const minutesToDate = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return setTimeForDate(new Date(), hours, mins)
}

export const time24ToDate = (str) => {
  const minutes = time24ToMinutes(str)
  return minutesToDate(minutes)
}

export const time24ToDateStr = (str, fmt = TIME) => {
  const minutes = time24ToMinutes(str)
  return format(minutesToDate(minutes), fmt)
}

export const minutesToDates = (minutes) => {
  return minutes.map((minute) => {
    return minutesToDate(minute)
  })
}

export const getMinutesfromDate = (date) => {
  return date.getHours() * 60 + date.getMinutes()
}

export const makeDatepickerArgs = (
  requestedAtDate,
  weekdayTimes,
  excludedTimes,
  firstTimes,
  interval = 15,
  daysAhead
) => {
  const minDate = dateStrToDate(firstTimes.date)
  const maxDate =
    daysAhead != null ? add(new Date(), { days: daysAhead }) : null
  const currentDate = requestedAtDate || new Date()
  const weekday = format(currentDate, 'EEEE').toUpperCase()
  const dateStr = format(currentDate, 'yyyy-MM-dd')
  const minutes = requestedAtDate ? getMinutesfromDate(requestedAtDate) : null
  const isToday = dateStr === todayDate()
  /* if today, excluded all times before the first minute */
  const todayExcludeded = isToday
    ? [...range(0, firstTimes.minutes - interval, interval)]
    : []
  /* weekdayExcluded = times excluded based on regular hours + blocked hours */
  const weekdayExcluded = weekdayTimes[weekday] || []
  /* otherExcluded = times excluded due to holiday hours + throttled times */
  const otherExcluded = excludedTimes[dateStr] || []
  const allExcluded = [
    ...new Set([...todayExcludeded, ...weekdayExcluded, ...otherExcluded]),
  ].sort()
  const orderableTimes = makeOppositeTimes(allExcluded, interval)
  const minOrderableTime = Math.min(...orderableTimes)
  // minTime and maxTime aren't necessary because they're already
  // blocked out by the exluded times
  // const minTime = minutesToDate(minOrderableTime)
  // const maxOrderableTime = Math.max(...orderableTimes)
  // const maxTime = minutesToDate(maxOrderableTime)
  let updatedDate = null
  if (minutes && allExcluded.includes(minutes)) {
    updatedDate = new Date(requestedAtDate.getTime())
    updatedDate.setHours(Math.floor(minOrderableTime / 60))
    updatedDate.setMinutes(minOrderableTime % 60)
  }
  /* TODO: figure out how to use this to hide times before open & after close */
  // const minOrderableTime = Math.min(...orderableTimes)
  // const maxOrderableTime = Math.max(...orderableTimes)
  // const adjustedExcluded = makeOppositeTimes(
  //   orderableTimes,
  //   interval,
  //   minOrderableTime,
  //   maxOrderableTime
  // )
  // const injectTimes = minutesToDates(orderableTimes)
  // const excludeTimes = minutesToDates(adjustedExcluded)
  /* convert excluded minutes to excluded dates */
  const excludeTimes = minutesToDates(allExcluded)
  /* filter out days of the week that are always closed */
  const closedWeekdays = makeClosedWeekdays(weekdayTimes)
  const isClosed = (date) => {
    return !closedWeekdays.includes(date.getDay())
  }
  return { excludeTimes, isClosed, updatedDate, minDate, maxDate }
}

export const makeOrderTimes = (orderTimes, tz) => {
  const currentDate = new Date()
  const withDates = orderTimes.map((i) => {
    const { weekday, time } = i.order_by
    let orderByDate = weekdayAndTimeToDate(weekday, time)
    let startDate = weekdayAndTimeToDate(i.weekday, i.start_time)
    // if (orderByDate < currentDate || startDate < currentDate) {
    //   startDate = add(startDate, { days: 7 })
    // }
    if (orderByDate < currentDate) {
      orderByDate = add(orderByDate, { days: 7 })
    }
    if (startDate < orderByDate) {
      startDate = add(startDate, { days: 7 })
    }
    const orderBy = { ...i.order_by, date: orderByDate }
    return {
      ...i,
      date: startDate,
      iso: dateToIso(startDate, tz),
      order_by: orderBy,
    }
  })
  return withDates.sort((a, b) => a.date - b.date)
}

export const makeFirstTime = (
  settings,
  tz,
  serviceType,
  revenueCenterType,
  requestedAt
) => {
  const { first_times, order_times } = settings
  if (!first_times || !first_times[serviceType]) {
    if (!order_times || !order_times[serviceType]) return null
    const orderTimes = makeOrderTimes(order_times[serviceType], tz)
    return orderTimes[0].iso
  }
  const firstTime = first_times[serviceType]
  const firstDate = isoToDate(firstTime.utc, tz)
  const hasAsap = firstTime.date === todayDate() && revenueCenterType === 'OLO'
  if (requestedAt === 'asap' && hasAsap) {
    return 'asap'
  }
  const requestedDate =
    requestedAt && requestedAt !== 'asap' ? isoToDate(requestedAt, tz) : null
  if (requestedDate && requestedDate > firstDate) {
    return requestedAt
  }
  // return hasAsap && firstDate > requestedDate ? 'asap' : firstTime.utc
  return firstTime.utc
}

export const makeFirstRequestedAt = (
  revenueCenter,
  serviceType,
  requestedAt
) => {
  const { timezone, settings, revenue_center_type } = revenueCenter
  const tz = timezoneMap[timezone]
  requestedAt = requestedAt || (revenue_center_type === 'OLO' ? 'asap' : null)
  const menuServiceType = menuServiceTypeMap[serviceType]
  return makeFirstTime(
    settings,
    tz,
    menuServiceType,
    revenue_center_type,
    requestedAt
  )
}

export const makeFirstTimes = (revenueCenter, serviceType, requestedAt) => {
  const {
    timezone,
    settings,
    revenue_center_type: revenueCenterType,
  } = revenueCenter
  const menuServiceType = menuServiceTypeMap[serviceType]
  const tz = timezoneMap[timezone]
  const otherServiceType = menuServiceType === 'PICKUP' ? 'DELIVERY' : 'PICKUP'
  const current = makeFirstTime(
    settings,
    tz,
    menuServiceType,
    revenueCenterType,
    requestedAt
  )
  const other = makeFirstTime(
    settings,
    tz,
    otherServiceType,
    revenueCenterType,
    requestedAt
  )
  if (!current && !other) return null
  return [
    current ? { serviceType: menuServiceType, requestedAt: current } : null,
    other ? { serviceType: otherServiceType, requestedAt: other } : null,
  ]
  // return { [serviceType]: current, [otherServiceType]: other }
}
