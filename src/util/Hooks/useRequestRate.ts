import { useState, useRef, useCallback } from 'react'
import { noop } from './useDebounceWait'

// 控制函数发送速率 防抖进化版

function useRequestRate<T extends noop>(fn: T, rateTime?: number) {
  // 时间 在控制时间内,如果发生了函数调用,则重新计算时间
  const time = rateTime ?? 100
  // 使用ref存储定时器
  const timerRef = useRef<any>()
  const [isCancel, setCancel] = useState(false)

  const [nowValue, setValue] = useState<any>()

  const controlRate = useCallback(
    (chart: string) => {
      setCancel(false)
      clearTimeout(timerRef.current)
      setValue(chart)
      timerRef.current = setTimeout(() => {
        setCancel(true)
      }, time)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCancel]
  )
  return [nowValue, isCancel, controlRate]
}

export default useRequestRate
