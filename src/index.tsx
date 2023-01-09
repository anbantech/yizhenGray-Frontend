// import './mock'
import 'antd/dist/antd.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './app'
import { initClientRunningEnvironment } from './util/env'

export const ifNeedShowLogo = !!window.PROJECT_BASE_CONFIG.logo
export const ifNeedEmulated = window.PROJECT_BASE_CONFIG.is_emulated

const tags = {
  env_tag: process.env.NODE_ENV,
  version: process.env.VERSION,
  branch: process.env.BRANCH,
  template_version: process.env.TEMPLATE_VERSION
}

initClientRunningEnvironment(tags)

Object.assign(window, { TAGS: tags })

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#root')
)
