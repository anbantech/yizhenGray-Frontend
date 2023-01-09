import { useCallback, useEffect, useState } from 'react'
import { sleep } from 'Src/util/baseFn'
import { useBindEventListener } from 'Src/util/Hooks/useBindEventListener'

export const getCurretTimeString = () => `${+new Date()}`.slice(0, 10)
const UseWebsocket = () => {
  const [messageInfo, setMessage] = useState()
  const [wsInstance, setWsInstance] = useState<WebSocket | null | undefined>()

  const createWsInstance = useCallback(async (cb?: (ws: WebSocket | null | undefined) => void) => {
    const ws = new WebSocket(`ws://${window.location.host}/socket/message`)
    while (ws.readyState !== 1) {
      if (ws.readyState === 2 || ws.readyState === 3) {
        await sleep(5000)
        createWsInstance(cb)
        return
      }
      await sleep(100)
    }
    // 在连接成功后再去更新 state，保证页面不会因为无效的 socket 连接而重复渲染
    setWsInstance(ws)
    // 成功连接之后触发的回调
    cb?.(ws)
    return ws
  }, [])

  const messageEventListener = useCallback(
    (ev: MessageEvent) => {
      const message = JSON.parse(ev.data)
      if (typeof message !== 'number') {
        setMessage(message)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wsInstance]
  )
  useEffect(() => {
    createWsInstance(ws => ws?.send('1'))
    return () => {
      createWsInstance(ws => ws?.close())
    }
  }, [createWsInstance])
  useBindEventListener(wsInstance, 'message', messageEventListener)
  //   useBindEventListener(wsInstance, 'close', closeEventListener)

  return [messageInfo]
}

export default UseWebsocket
