/*
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-01 18:06:48
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-23 10:17:25
 * @FilePath: /yizhen-frontend/public/config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const PROJECT_BASE_CONFIG = {
  logo: true,
  is_emulated: true
}

function changeFaviconAndTitle() {
  const iconLink = document.createElement('link')
  iconLink.rel = 'shortcut icon'
  iconLink.type = 'image/x-icon'
  iconLink.href = PROJECT_BASE_CONFIG.logo ? '/favicon.ico' : 'data:;'
  document.head.appendChild(iconLink)
  const title = document.createElement('title')
  title.innerHTML = PROJECT_BASE_CONFIG.logo ? '易复 | 协议模糊测试系统' : '网络协议模糊测试工具'
  document.head.appendChild(title)
}

window.PROJECT_BASE_CONFIG = PROJECT_BASE_CONFIG
changeFaviconAndTitle()
