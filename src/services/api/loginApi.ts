import { loginParams } from 'Src/globalType/Param'
import { resLogin } from 'Src/globalType/Response'
import request from 'Src/services/request/request'

/*
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-08-26 15:55:05
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-08-26 16:30:31
 * @FilePath: /yizhen-frontend/src/Api/loginApi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function loginIn(params: loginParams) {
  return request.post<resLogin>(`/api/v1.0/users/login`, params)
}

export function logout() {
  return request.post(`/api/v1.0/users/logout`)
}

export function getUserInfo() {
  return request.get(`/api/v1.0/users/detail`)
}

export function resetPassword(params: { userId: number; username: string; password: string; confirm_password: string; admin_password: string }) {
  const { userId, ...restParams } = params
  return request.put(`/api/v1.0/users/update/${userId}`, restParams)
}

export function getLicense() {
  return request.get(`/api/v1.0/system/license`)
}
