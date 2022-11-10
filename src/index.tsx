// import './mock'
import 'antd/dist/antd.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './app'

export const ifNeedShowLogo = !!window.PROJECT_BASE_CONFIG.logo
export const ifNeedEmulated = window.PROJECT_BASE_CONFIG.is_emulated

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#root')
)
