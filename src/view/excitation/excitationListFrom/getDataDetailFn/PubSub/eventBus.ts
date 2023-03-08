type CallBackFn = (value: string | number) => void
type GetReturnType = (...args: any[]) => void
type EventName = string
interface EventObjType {
  [key: string]: Array<GetReturnType>
}
const EventObj: EventObjType = {}

export const $onEvent = (eventName: EventName, cb: CallBackFn) => {
  if (!EventObj[eventName]) {
    EventObj[eventName] = []
  }
  EventObj[eventName].push(cb)
}

export const $emitEvent = (eventName: EventName, ...args: any[]) => {
  if (EventObj[eventName]) {
    EventObj[eventName].forEach((cb: GetReturnType) => cb(...args))
  }
}
