export function getHiddenPropertyName() {
  let eventName = ''
  const property = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : ''
  if (property) {
    eventName = property.replace(/hidden/i, 'visibilitychange')
  }
  return {
    property,
    eventName
  }
}
export function getTime(Data: string) {
  if (Data) {
    const time = Data?.split('.')
    return time[0]
  }
  return ''
}

export async function sleep(ms: number) {
  await new Promise<void>(resolve =>
    setTimeout(() => {
      resolve()
    }, ms)
  )
}
