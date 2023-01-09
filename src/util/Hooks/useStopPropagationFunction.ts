import { useCallback } from 'react'

/**
 * 阻止冒泡封装
 * @param callback
 * @returns a callback fn that extend stopPropagation
 * @example
 * const callback = useStopPropagationFunction(
 *    useCallback(e => console.log(e.target), [])
 * )
 */
export const useStopPropagationFunction = (callback: (e: any) => void) => {
  const cb = useCallback(
    e => {
      e.stopPropagation()
      callback(e)
    },
    [callback]
  )
  return cb
}
