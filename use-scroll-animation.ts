"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  animationClass?: string
  initialClass?: string
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  rootMargin = "0px",
  animationClass = "opacity-100 translate-y-0",
  initialClass = "opacity-0 translate-y-10",
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Optionally, unobserve after it becomes visible to prevent re-triggering
          // observer.unobserve(entry.target);
        } else {
          // If you want the animation to reset when scrolling out of view
          // setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, rootMargin])

  const classes = `transition-all duration-700 ease-out ${isVisible ? animationClass : initialClass}`

  return { ref, classes }
}
