import { getSystem } from 'Src/services/api/loginApi'
import { throwErrorMessage } from 'Src/util/message'
import { create } from 'zustand'

interface SystemStore {
  PROCESSOR: [] | Record<string, any>[]
  REGISTER_CMD: [] | Record<string, any>[]
  ALGORITHM: [] | Record<string, any>[]
  PERIPHERAL_TYPE: [] | Record<string, any>[]
  RESET_MODE: [] | Record<string, any>[]
  ERROR_KIND_MAP: [] | Record<string, any>[]
  getSystemList: () => void
}

const useWebSocketStore = create<WsStore>((set, get) => ({
  socket: null,
  messages: null,
  readyState: null,
  connect: () => {
    const socket = new WebSocket(`ws://${window.location.host}/socket/message`)
    socket.addEventListener('open', () => {
      set({ socket })
    })
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data)
      if (typeof message !== 'number') {
        set({ messages: message })
      }
    })
  },
  sendMessage: (id: number, type: string, instanced?: number) => {
    const { socket } = get()
    if (socket && socket.readyState === socket.OPEN) {
      if (id && type === 'task') {
        socket.send(JSON.stringify({ task_id: id, cmd: '' }))
      }
      if (id && type === 'instance') {
        socket.send(JSON.stringify({ task_id: id, cmd: '', instance_id: instanced }))
      }
    }
  }
}))

const getSystemConstantsStore = create<SystemStore>(set => ({
  PROCESSOR: [],
  REGISTER_CMD: [],
  ALGORITHM: [],
  PERIPHERAL_TYPE: [],
  RESET_MODE: [],
  ERROR_KIND_MAP: [],
  getSystemList: async () => {
    try {
      const res = await getSystem()
      if (res.data) {
        const { PROCESSOR, REGISTER_CMD, ALGORITHM, PERIPHERAL_TYPE, RESET_MODE, ERROR_KIND_MAP } = res.data
        set({ PROCESSOR, REGISTER_CMD, ALGORITHM, PERIPHERAL_TYPE, RESET_MODE, ERROR_KIND_MAP })
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }
}))

const sendMessageFn = useWebSocketStore.getState().sendMessage
export { getSystemConstantsStore, useWebSocketStore, sendMessageFn }
