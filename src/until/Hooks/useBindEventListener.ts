import { useCallback, useEffect } from 'react'

interface EventTarget {
  addEventListener<K = string>(event: K, callback: (e: any) => any): any
  removeEventListener(...args: any[]): any
}

/**
 * 自定义事件订阅钩子，用于在组件渲染后绑定事件并在组件销毁时自动解绑事件
 * @param target 绑定目标，可以是 window, document, element
 * @param eventName 监听事件
 * @param eventCallback 回调函数
 * @returns 取消绑定函数，可以利用 return 的函数手动取消绑定事件
 * @example
 * useBindEventListener(window, 'resize', resizeFn)
 */
export const useBindEventListener = (target: EventTarget | null | undefined, eventName: string, eventCallback: (e: any) => any) => {
  const eventListener = useCallback(eventCallback, [eventCallback])

  useEffect(() => {
    if (!target) return
    target.addEventListener(eventName, eventListener)
    return () => {
      if (!target) return
      target.removeEventListener(eventName, eventListener)
    }
  }, [eventListener, eventName, target])

  return () => {
    if (!target) return
    target.removeEventListener(eventName, eventListener)
  }
}
