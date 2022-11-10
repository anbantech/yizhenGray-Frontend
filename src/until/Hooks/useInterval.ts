import { useEffect, useRef } from 'react'
import { useIsomorphicLayoutEffect } from 'Src/until/Hooks/useIsomorphicLayoutEffect'
/**
 *
 * @param callback interval callback function
 * @param interval interval, ms
 * @param options immediate execute if set true
 * @example
 * useInterval(() => {
 *    // do something in interval fn
 * }, 1000, { immediate: true })
 */
export const useInterval = (callback: () => void, interval: number | null, options?: { immediate: boolean }) => {
  const savedCallback = useRef(callback)

  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!interval && interval !== 0) {
      return
    }
    if (options?.immediate) {
      savedCallback.current()
    }
    const id = setInterval(() => savedCallback.current(), interval)
    return () => clearInterval(id)
  }, [interval, options?.immediate])
}
