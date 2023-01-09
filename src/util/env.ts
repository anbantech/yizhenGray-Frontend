/* eslint-disable no-underscore-dangle */
interface Tags {
  env_tag: string | undefined
  version: string | undefined
  branch: string | undefined
}

/**
 * 如果环境版本与当前版本不同，则直接清除 localStorage 所有信息
 */
export function initClientRunningEnvironment(newTags: Tags) {
  const localTags = JSON.parse(localStorage.getItem('tags') || '{}')
  if (localTags.version !== newTags.version) {
    localStorage.clear()
    localStorage.setItem('tags', JSON.stringify(newTags))
  }
  // eslint-disable-next-line no-console
  console.info(`当前运行版本：${newTags.version}`)
}

export function normalizeVersion(targetVersion: string) {
  const regexp = /^v?(\d+)\.(\d+)\.(\d+)[._|]?(.*)?/
  const matchResult = targetVersion.match(regexp)
  const [, major = '', minor = '', patch = ''] = matchResult || []
  return {
    major,
    minor,
    patch,
    version: `v${major}.${minor}.${patch}`
  }
}

export function checkVersion(targetVersion = '') {
  const _currentVersion = normalizeVersion(window.TAGS.version || '')
  const _targetVersion = normalizeVersion(targetVersion)
  return _currentVersion.version === _targetVersion.version
}
