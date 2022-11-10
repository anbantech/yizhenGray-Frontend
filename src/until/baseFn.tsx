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
