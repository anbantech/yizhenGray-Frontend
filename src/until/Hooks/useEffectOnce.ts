import { useEffect, EffectCallback } from 'react'

/**
 * 组件首次渲染或销毁时执行，用法与 useEffect 完全相同
 * @param effect 回调函数
 * @example
 * useEffectOnce(() => {
 *    // do something at first render
 * })
 */
export const useEffectOnce = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
