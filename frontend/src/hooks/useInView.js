import { useEffect, useRef, useState } from 'react'

export default function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined'
  )

  useEffect(() => {
    const element = ref.current

    if (!element || inView) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -48px 0px',
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [inView, options.threshold, options.rootMargin])

  return { ref, inView }
}