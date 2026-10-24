export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

export const loopAutoplay = (delay) =>
  prefersReducedMotion() ? false : { delay, disableOnInteraction: false, pauseOnMouseEnter: true }
