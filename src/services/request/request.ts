/*
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-01 18:06:48
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-27 15:18:49
 * @FilePath: /yizhen-frontend/src/utils/request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Axios from 'axios'
import { normalizeQueryParams } from '../utils/parser'

/**
 * 用于处理后端服务更新间隔
 * 如果间隔小于规定秒数，则认为服务正在更新
 * 如果间隔大于规定描述，则认为服务不再更新
 */
export const dataBaseUpdateController = {
  lastUpdateTime: +new Date(),
  reset() {
    dataBaseUpdateController.lastUpdateTime = +new Date()
  },
  isUpdating() {
    const now = +new Date()
    const diff = now - dataBaseUpdateController.lastUpdateTime
    return diff <= 60 * 1000
  }
}

const instance = Axios.create({
  // 超时时间
  timeout: 90000
})
// eslint-disable-next-line import/no-mutable-exports
// export let cancelFn = (cancel: string) => {
//   console.log(cancel)
// }
// export function request(Args: AxiosRequestConfig) {
//   // 在请求配置中增加取消请求的Token
//   // eslint-disable-next-line func-names, no-param-reassign
//   Args.cancelToken = new CancelToken(function (cancel) {
//     cancelFn = cancel
//   })
//   return instance.request(Args)
// }

instance.interceptors.request.use(res => {
  // addRequest(res)
  if (res.params) {
    res.params = normalizeQueryParams(res.params)
  }

  const token = window.localStorage.getItem('access_token')
  if (token) {
    res.headers.Authorization = `Bearer ${token}`
  }
  return res
})

instance.interceptors.response.use(
  res => {
    /**
     * 处理 blob 文件流返回值
     * 从 http headers 中取到文件名和文件流，抛出给业务逻辑层
     */
    if (res.headers['content-disposition']) {
      let fileName
      try {
        // eslint-disable-next-line prefer-destructuring
        fileName = res.headers['content-disposition'].match('filename=(.*)')[1]
      } catch {
        fileName = '固件检测报告.pdf'
      }
      if (res.status === 200) return { data: res.data, fileName }
      return Promise.reject(new Error('前端拒绝接受错误码文件'))
    }
    /**
     * 正常接口，直接返回 res.data
     */
    const { code } = res.data
    if (+code < 300) {
      return res.data
    }
    if (+code > 300 && res.status === 200) {
      return res.data
    }
  },
  error => {
    /**
     * http 500 错误
     * 后端接口异常，直接抛出服务异常
     */
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('“网络连接失败，请检查网络'))
    }
    if (error.response?.status >= 500) {
      if (dataBaseUpdateController.isUpdating()) {
        return {}
      }
      return Promise.reject(new Error('服务异常'))
    }
    // 没有 token 401
    // token 错误 403
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 重定向
      window.localStorage.removeItem('access_token')
      window.localStorage.removeItem('userId')
      window.location.href = '/login'
      return Promise.reject(new Error('身份令牌失效'))
    }
    /**
     * http 400, 1011 错误码，数据正在导入中，捕获错误并返回空对象
     * 下层业务逻辑 res.data 会判断为 undefined 不走赋值逻辑
     */
    if (error.response?.data?.code === 1011) {
      return {}
    }
    /**
     * http 400，其他错误码
     * 抛出后端的 error.response.data 对象给 throwErrorMessage 处理
     */
    if (error.response?.data) {
      return Promise.reject(error.response.data)
    }
    /**
     * 未知错误
     */
    return Promise.reject(error)
  }
)

export default instance
