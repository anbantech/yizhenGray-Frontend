const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const SERVER_HOST = '0.0.0.0'
const SERVER_PORT = 9001

const PROJECT_PATH = path.resolve(__dirname, '../')
const PROJECT_NAME = path.parse(PROJECT_PATH).name

// 是否开启 modules 缓存
const IS_OPEN_HARD_SOURCE = true

// 是否开启 bundle 包分析
const shouldOpenAnalyzer = false

module.exports = {
  isDev,
  SERVER_HOST,
  SERVER_PORT,
  PROJECT_PATH,
  PROJECT_NAME,
  IS_OPEN_HARD_SOURCE,
  shouldOpenAnalyzer,
}
