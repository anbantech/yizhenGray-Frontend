// import { useState, useRef, useCallback } from 'react'
// import { noop } from './useDebounceWait'

// 控制函数发送速率 防抖进化版

function useRequestRate(fn: noop, rateTime?: number) {
  // 时间 在控制时间内,如果发生了函数调用,则重新计算时间
  //   const time = rateTime ?? 100
  //   // 使用ref存储定时器
  //   const timerRef = useRef<any>()
  //   const [isCancel, setCancel] = useState(false)
  //   const [value, setValue] = useState()
  //   const controlRate = useCallback(() => {
  //   }, [])
  //   return [value, controlRate]
}

export default useRequestRate
