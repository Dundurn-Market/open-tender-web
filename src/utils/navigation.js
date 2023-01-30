
export const scrollToId = (hash, yOffset) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  const element = document.querySelector(`#${hash}`)
  if (!element) return

  const y = element.getBoundingClientRect().top + window.scrollY - yOffset
  window.scrollTo({top: y, behavior: 'smooth'})
  }
