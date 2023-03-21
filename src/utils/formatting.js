
export const remToPx = (rem) => {
  const val = parseFloat(rem.slice(0, rem.length - 3))
  const ratio = parseFloat(getComputedStyle(document.documentElement).fontSize)
  return val * ratio
}
