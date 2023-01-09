import debounce from 'lodash/throttle'
import { useMemo } from 'react'
import { useLatest } from './useLast'

type Fn = (value?: any) => void

// 参数:bassData:默认数据
// 功能:在一定时间内,收集用户点击的信息,然后返回一个对象

interface ThrottleOptions {
  wait?: number
  leading?: boolean
  trailing?: boolean
}
export type noop = (...args: any) => any

function useDebounceWait<T extends noop>(fn: T, options?: ThrottleOptions) {
  const fnRef = useLatest(fn)

  const wait = options?.wait ?? 1000

  const debounced = useMemo(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args)
        },
        wait,
        options
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush
  }
}

export default useDebounceWait
