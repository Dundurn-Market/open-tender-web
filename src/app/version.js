import * as Sentry from '@sentry/react'

// https://dev.to/flexdinesh/cache-busting-a-react-app-22lk
// https://github.com/flexdinesh/cache-busting-example/blob/master/src/App.js

// version from response - first param, local version second param
const semverGreaterThan = (latest, current) => {
  if (!latest || !current) return false

  const [releaseA, prereleaseA] = latest.split(/-/)
  const [releaseB, prereleaseB] = current.split(/-/)

  const relA = releaseA.split(/\./g)
  const relB = releaseB.split(/\./g)

  while (relA.length || relB.length) {
    const a = Number(relA.shift())
    const b = Number(relB.shift())
    // eslint-disable-next-line no-continue
    if (a === b) continue
    // eslint-disable-next-line no-restricted-globals
    return a > b || isNaN(b)
  }

  if (prereleaseA === undefined) return (prereleaseB !== undefined)
  if (prereleaseB === undefined) return false

  const preA = prereleaseA.split(/\./g)
  const preB = prereleaseB.split(/\./g)

  while (preA.length || preB.length) {
    const a = preA.shift()
    const b = preB.shift()

    if (a === undefined) return false
    if (b === undefined) return true

    if (isNaN(Number(a))) {
      if (a === b) continue
      return a > b || !isNaN(Number(b))
    }
    if (isNaN(Number(b))) return false

    if (Number(a) === Number(b)) continue
    return Number(a) > Number(b)
  }

  return false
}

export const maybeRefreshVersion = () => {
  fetch('/meta.json', { cache: 'no-store' })
    .then((response) => response.json())
    .then((meta) => {
      const latest = meta.version
      const current = global.appVersion
      const shouldForceRefresh = semverGreaterThan(latest, current)
      if (shouldForceRefresh) {
        window.location.reload(true)
      }
    })
    .catch((err) => Sentry.captureException(err))
}
