interface WsStore {
  socket: WebSocket | null
  messages: null | Record<string, any>
  connect: () => void
  sendMessage: (id: number, type: string, instanced?: number) => void
  //   readyState: () => void
}
