import { create } from 'zustand'

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

export default useWebSocketStore
